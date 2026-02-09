package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// TransactionService defines the business logic for unified transactions.
type TransactionService interface {
	Create(ctx context.Context, req *dto.CreateTransactionRequest, creatorID uuid.UUID) (*dto.TransactionResponse, error)
	GetByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*dto.TransactionResponse, error)
	List(ctx context.Context, familyID uuid.UUID, userID uuid.UUID, filters map[string]interface{}) (*dto.TransactionListResponse, error)
	Update(ctx context.Context, id uuid.UUID, req *dto.UpdateTransactionRequest, userID uuid.UUID) (*dto.TransactionResponse, error)
	Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
	GetStats(ctx context.Context, familyID uuid.UUID, userID uuid.UUID, filters map[string]interface{}) (*dto.TransactionStatsResponse, error)
	ResolveCategoryID(ctx context.Context, name string, type_ model.TransactionCategoryType, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error)
	ResolvePaymentMethodID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error)
}

type transactionService struct {
	txRepo       repository.TransactionRepository
	categoryRepo repository.TransactionCategoryRepository
	walletRepo   repository.WalletRepository
	paymentRepo  repository.PaymentMethodRepository
	familyRepo   repository.FamilyRepository
	db           *gorm.DB
	logger       *logrus.Logger
}

// NewTransactionService creates a new instance of transactionService.
func NewTransactionService(
	txRepo repository.TransactionRepository,
	categoryRepo repository.TransactionCategoryRepository,
	walletRepo repository.WalletRepository,
	paymentRepo repository.PaymentMethodRepository,
	familyRepo repository.FamilyRepository,
	db *gorm.DB,
	logger *logrus.Logger,
) TransactionService {
	return &transactionService{
		txRepo:       txRepo,
		categoryRepo: categoryRepo,
		walletRepo:   walletRepo,
		paymentRepo:  paymentRepo,
		familyRepo:   familyRepo,
		db:           db,
		logger:       logger,
	}
}

func (s *transactionService) Create(ctx context.Context, req *dto.CreateTransactionRequest, creatorID uuid.UUID) (*dto.TransactionResponse, error) {
	// 1. Convert DTO to Model
	txModel, err := req.ToModel(creatorID)
	if err != nil {
		return nil, NewValidationError(err.Error())
	}

	// 2. Validate Wallet
	wallet, err := s.walletRepo.GetByID(ctx, txModel.WalletID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("wallet", txModel.WalletID)
		}
		return nil, NewInternalError("verify wallet", err)
	}

	// Verify wallet belongs to family
	if wallet.FamilyID != txModel.FamilyID {
		return nil, NewUnauthorizedError("wallet does not belong to your family")
	}

	// 3. Execute in Transaction
	err = s.db.WithContext(ctx).Transaction(func(dbTx *gorm.DB) error {
		// Create Transaction Record
		created, err := s.txRepo.Create(ctx, txModel)
		if err != nil {
			return err
		}

		// Update Wallet Balance
		delta := txModel.Amount
		if txModel.Type == model.CategoryTypeExpense {
			delta = -txModel.Amount
		}

		if err := s.walletRepo.UpdateBalanceWithTx(ctx, dbTx, txModel.WalletID, delta); err != nil {
			return err
		}

		txModel.ID = created.ID
		return nil
	})

	if err != nil {
		return nil, NewInternalError("create transaction", err)
	}

	// 4. Fetch with relations for response
	fullTx, _ := s.txRepo.GetByID(ctx, txModel.ID)
	return dto.ToTransactionResponse(fullTx), nil
}

func (s *transactionService) GetByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*dto.TransactionResponse, error) {
	tx, err := s.txRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("transaction", id)
		}
		return nil, NewInternalError("get transaction", err)
	}

	// Basic authorization check (can be expanded to family-based check if needed)
	// For now, if user created it or is in the same family, it's okay.
	// But let's stick to family check if the context permits.

	return dto.ToTransactionResponse(tx), nil
}

func (s *transactionService) List(ctx context.Context, familyID uuid.UUID, userID uuid.UUID, filters map[string]interface{}) (*dto.TransactionListResponse, error) {
	txs, total, err := s.txRepo.List(ctx, familyID, &userID, filters)
	if err != nil {
		return nil, NewInternalError("list transactions", err)
	}

	responses := make([]dto.TransactionResponse, len(txs))
	for i := range txs {
		responses[i] = *dto.ToTransactionResponse(&txs[i])
	}

	page := 1
	if p, ok := filters["page"].(int); ok {
		page = p
	}
	pageSize := 10
	if ps, ok := filters["page_size"].(int); ok {
		pageSize = ps
	}

	return &dto.TransactionListResponse{
		Transactions: responses,
		TotalCount:   total,
		Page:         page,
		PageSize:     pageSize,
	}, nil
}

func (s *transactionService) Update(ctx context.Context, id uuid.UUID, req *dto.UpdateTransactionRequest, userID uuid.UUID) (*dto.TransactionResponse, error) {
	// 1. Get existing transaction
	existing, err := s.txRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("transaction", id)
		}
		return nil, NewInternalError("get transaction", err)
	}

	// 2. Prepare Updates
	walletID, err := uuid.Parse(req.WalletID)
	if err != nil {
		return nil, NewValidationError("invalid wallet_id")
	}

	// 3. Execute in Transaction
	err = s.db.WithContext(ctx).Transaction(func(dbTx *gorm.DB) error {
		// A. Revert old balance effect
		oldDelta := -existing.Amount
		if existing.Type == model.CategoryTypeExpense {
			oldDelta = existing.Amount
		}
		if err := s.walletRepo.UpdateBalanceWithTx(ctx, dbTx, existing.WalletID, oldDelta); err != nil {
			return err
		}

		// B. Apply new balance effect
		newDelta := req.Amount
		if existing.Type == model.CategoryTypeExpense {
			newDelta = -req.Amount
		}
		if err := s.walletRepo.UpdateBalanceWithTx(ctx, dbTx, walletID, newDelta); err != nil {
			return err
		}

		// C. Update Record
		existing.Amount = req.Amount
		existing.Description = req.Description
		existing.WalletID = walletID
		existing.TransactionDate = req.TransactionDate
		
		if req.CategoryID != nil {
			catID, _ := uuid.Parse(*req.CategoryID)
			existing.CategoryID = &catID
		}
		
		if req.PaymentMethodID != nil {
			pmID, _ := uuid.Parse(*req.PaymentMethodID)
			existing.PaymentMethodID = &pmID
		}

		_, err = s.txRepo.Update(ctx, id, existing)
		if err != nil {
			return err
		}

		// Update Items: For simplicity, delete old items and create new ones
		// This is a common pattern for list items in transactional updates
		if err := dbTx.Where("transaction_id = ?", id).Delete(&model.TransactionItem{}).Error; err != nil {
			return err
		}

		if len(req.Items) > 0 {
			newItems := make([]model.TransactionItem, len(req.Items))
			for i, item := range req.Items {
				mItem := model.TransactionItem{
					TransactionID: id,
					Name:          item.Name,
					Amount:        item.Amount,
					Quantity:      item.Quantity,
					UnitPrice:     item.UnitPrice,
				}
				if item.CategoryID != nil {
					catID, _ := uuid.Parse(*item.CategoryID)
					mItem.CategoryID = &catID
				}
				newItems[i] = mItem
			}
			if err := dbTx.Create(&newItems).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		return nil, NewInternalError("update transaction", err)
	}

	return s.GetByID(ctx, id, userID)
}

func (s *transactionService) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	// 1. Get existing transaction
	existing, err := s.txRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return NewNotFoundError("transaction", id)
		}
		return NewInternalError("get transaction", err)
	}

	// 2. Execute in Transaction
	return s.db.WithContext(ctx).Transaction(func(dbTx *gorm.DB) error {
		// A. Revert balance effect
		delta := -existing.Amount
		if existing.Type == model.CategoryTypeExpense {
			delta = existing.Amount
		}
		if err := s.walletRepo.UpdateBalanceWithTx(ctx, dbTx, existing.WalletID, delta); err != nil {
			return err
		}

		// B. Delete Record
		return s.txRepo.Delete(ctx, id)
	})
}

func (s *transactionService) GetStats(ctx context.Context, familyID uuid.UUID, userID uuid.UUID, filters map[string]interface{}) (*dto.TransactionStatsResponse, error) {
	statsMap, err := s.txRepo.GetStats(ctx, familyID, &userID, filters)
	if err != nil {
		return nil, NewInternalError("get transaction stats", err)
	}

	return &dto.TransactionStatsResponse{
		TotalCount:    statsMap["total_count"].(int64),
		TotalAmount:   statsMap["total_amount"].(float64),
		ThisMonth:     statsMap["this_month"].(float64),
		LastMonth:     statsMap["last_month"].(float64),
		AverageAmount: statsMap["average_amount"].(float64),
	}, nil
}

func (s *transactionService) ResolveCategoryID(ctx context.Context, name string, type_ model.TransactionCategoryType, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error) {
	category, err := s.categoryRepo.GetByName(ctx, name, type_, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new category
			newCat := &model.TransactionCategory{
				ID:          uuid.New(),
				Name:        name,
				Type:        type_,
				FamilyID:    &familyID,
				IsSystem:    false,
				IsActive:    true,
			}
			created, err := s.categoryRepo.Create(ctx, newCat)
			if err != nil {
				return uuid.Nil, err
			}
			return created.ID, nil
		}
		return uuid.Nil, err
	}
	return category.ID, nil
}

func (s *transactionService) ResolvePaymentMethodID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error) {
	pm, err := s.paymentRepo.GetByName(ctx, name, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new payment method
			newPm := model.PaymentMethod{
				ID:          uuid.New(),
				Name:        name,
				FamilyID:    &familyID,
				CreatedByID: &userID,
				IsSystem:    false,
			}
			created, err := s.paymentRepo.Create(ctx, newPm)
			if err != nil {
				return uuid.Nil, err
			}
			return created.ID, nil
		}
		return uuid.Nil, err
	}
	return pm.ID, nil
}
