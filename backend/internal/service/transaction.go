package service

import (
	"context"
	"errors"
	"fmt"

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
	ResolveWalletID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error)
	ResolveContactID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error)
	ResolveProjectID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error)
	ResolveLocationID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error)
	BulkImport(ctx context.Context, req *dto.BulkImportTransactionsRequest, familyID uuid.UUID, userID uuid.UUID) (*dto.BulkImportTransactionsResponse, error)
}

type transactionService struct {
	txRepo       repository.TransactionRepository
	categoryRepo repository.TransactionCategoryRepository
	walletRepo   repository.WalletRepository
	walletTypeRepo repository.WalletTypeRepository
	paymentRepo  repository.PaymentMethodRepository
	contactRepo  repository.ContactRepository
	projectRepo  repository.ProjectRepository
	locationRepo repository.LocationRepository
	tagRepo      repository.TagRepository
	familyRepo   repository.FamilyRepository
	notificationService NotificationService
	db           *gorm.DB
	logger       *logrus.Logger
}

// NewTransactionService creates a new instance of transactionService.
func NewTransactionService(
	txRepo repository.TransactionRepository,
	categoryRepo repository.TransactionCategoryRepository,
	walletRepo repository.WalletRepository,
	walletTypeRepo repository.WalletTypeRepository,
	paymentRepo repository.PaymentMethodRepository,
	contactRepo repository.ContactRepository,
	projectRepo repository.ProjectRepository,
	locationRepo repository.LocationRepository,
	tagRepo repository.TagRepository,
	familyRepo repository.FamilyRepository,
	notificationService NotificationService,
	db *gorm.DB,
	logger *logrus.Logger,
) TransactionService {
	return &transactionService{
		txRepo:       txRepo,
		categoryRepo: categoryRepo,
		walletRepo:   walletRepo,
		walletTypeRepo: walletTypeRepo,
		paymentRepo:  paymentRepo,
		contactRepo:  contactRepo,
		projectRepo:  projectRepo,
		locationRepo: locationRepo,
		tagRepo:      tagRepo,
		familyRepo:   familyRepo,
		notificationService: notificationService,
		db:           db,
		logger:       logger,
	}
}

func (s *transactionService) Create(ctx context.Context, req *dto.CreateTransactionRequest, creatorID uuid.UUID) (*dto.TransactionResponse, error) {
	familyID, err := uuid.Parse(req.FamilyID)
	if err != nil {
		return nil, NewValidationError(err.Error())
	}

	// Resolve Category ID
	if req.CategoryID == "" {
		categoryID, err := s.ResolveCategoryID(ctx, req.Category.Value, req.Type, familyID, creatorID)
		if err != nil {
			return nil, NewValidationError(err.Error())
		}
		req.CategoryID = categoryID.String()
	}

	// Resolve Payment Method ID
	if req.PaymentMethodID == "" {
		paymentMethodID, err := s.ResolvePaymentMethodID(ctx, req.PaymentMethod.Value, familyID, creatorID)
		if err != nil {
			return nil, NewValidationError(err.Error())
		}
		req.PaymentMethodID = paymentMethodID.String()
	}

	// Resolve Contact ID
	if req.ContactID == "" {
		contactID, err := s.ResolveContactID(ctx, req.Contact.Value, familyID, creatorID)
		if err != nil {
			return nil, NewValidationError(err.Error())
		}
		req.ContactID = contactID.String()
	}

	// Resolve Location ID
	if req.LocationID == "" {
		locationID, err := s.ResolveLocationID(ctx, req.Location.Value, familyID, creatorID)
		if err != nil {
			return nil, NewValidationError(err.Error())
		}
		req.LocationID = locationID.String()
	}

	// Resolve Project ID
	if req.ProjectID == "" {
		projectID, err := s.ResolveProjectID(ctx, req.Project.Value, familyID, creatorID)
		if err != nil {
			return nil, NewValidationError(err.Error())
		}
		req.ProjectID = projectID.String()
	}

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
		existing.Title = req.Title
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

func (s *transactionService) ResolveWalletID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error) {
	if name == "" {
		return uuid.Nil, nil
	}
	wallet, err := s.walletRepo.GetByName(ctx, name, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Find a default Wallet Type (e.g. Cash)
			types, err := s.walletTypeRepo.List(ctx, familyID, userID)
			var typeID uuid.UUID
			if err == nil && len(types) > 0 {
				typeID = types[0].ID // Pick first available type
			} else {
				// Fallback or error? If no types exist, we can't create wallet.
				// For now let's assume at least one type exists (System types)
				return uuid.Nil, fmt.Errorf("no wallet types found")
			}
			
			newWallet := &model.Wallet{
				ID:          uuid.New(),
				Name:        name,
				FamilyID:    familyID,
				Currency:    "NPR", // Default
				WalletTypeID: typeID,
				Balance:     0,
				UserID:      userID,
			}
			created, err := s.walletRepo.Create(ctx, newWallet)
			if err != nil {
				return uuid.Nil, err
			}
			return created.ID, nil
		}
		return uuid.Nil, err
	}
	return wallet.ID, nil
}

func (s *transactionService) ResolveContactID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error) {
	if name == "" {
		return uuid.Nil, nil
	}
	contact, err := s.contactRepo.GetByName(ctx, name, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newContact := &model.Contact{
				ID:          uuid.New(),
				Name:        name,
				FamilyID:    familyID,
				Type:        model.ContactTypeVendor, // Default for expenses
				IsActive:    true,
			}
			err := s.contactRepo.Create(ctx, newContact)
			if err != nil {
				return uuid.Nil, err
			}
			return newContact.ID, nil
		}
		return uuid.Nil, err
	}
	return contact.ID, nil
}

func (s *transactionService) ResolveProjectID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error) {
	if name == "" {
		return uuid.Nil, nil
	}
	project, err := s.projectRepo.GetByName(ctx, name, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newProject := &model.Project{
				ID:          uuid.New(),
				Name:        name,
				FamilyID:    familyID,
				IsActive:    true,
			}
			err := s.projectRepo.Create(ctx, newProject)
			if err != nil {
				return uuid.Nil, err
			}
			return newProject.ID, nil
		}
		return uuid.Nil, err
	}
	return project.ID, nil
}

func (s *transactionService) ResolveLocationID(ctx context.Context, name string, familyID uuid.UUID, userID uuid.UUID) (uuid.UUID, error) {
	if name == "" {
		return uuid.Nil, nil
	}
	location, err := s.locationRepo.GetByName(ctx, name, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newLocation := &model.Location{
				ID:          uuid.New(),
				Name:        name,
				FamilyID:    &familyID,
			}
			err := s.locationRepo.Create(ctx, newLocation)
			if err != nil {
				return uuid.Nil, err
			}
			return newLocation.ID, nil
		}
		return uuid.Nil, err
	}
	return location.ID, nil
}

func (s *transactionService) BulkImport(ctx context.Context, req *dto.BulkImportTransactionsRequest, familyID uuid.UUID, userID uuid.UUID) (*dto.BulkImportTransactionsResponse, error) {
	// Verify family exists (Sync check)
	_, err := s.familyRepo.GetByID(ctx, familyID)
	if err != nil {
		return nil, NewNotFoundError("family", familyID)
	}

	// Run import in background
	go func(transactions []dto.BulkImportTransactionItemRequest, fID, uID uuid.UUID) {
		// Create a background context with a reasonable timeout or just Background
		bgCtx := context.Background()
		
		results := make([]dto.BulkImportResult, len(transactions))
		successCount := 0
		failedCount := 0

		for i, txReq := range transactions {
			// Resolve UUIDs
			walletID, err := s.ResolveWalletID(bgCtx, txReq.WalletName, fID, uID)
			if err != nil {
				results[i] = dto.BulkImportResult{RowIndex: i + 1, Success: false, Error: "Wallet error: " + err.Error()}
				failedCount++
				continue
			}
			if walletID == uuid.Nil {
				results[i] = dto.BulkImportResult{RowIndex: i + 1, Success: false, Error: "Wallet name required"}
				failedCount++
				continue
			}

			// Resolve Optional Entities
			var categoryID *string
			if txReq.CategoryName != "" {
				id, err := s.ResolveCategoryID(bgCtx, txReq.CategoryName, model.CategoryTypeExpense, fID, uID)
				if err == nil && id != uuid.Nil {
					sid := id.String()
					categoryID = &sid
				}
			}

			var paymentMethodID *string
			if txReq.PaymentMethodName != "" {
				id, err := s.ResolvePaymentMethodID(bgCtx, txReq.PaymentMethodName, fID, uID)
				if err == nil && id != uuid.Nil {
					sid := id.String()
					paymentMethodID = &sid
				}
			}

			var contactID *string
			if txReq.VendorName != "" {
				id, err := s.ResolveContactID(bgCtx, txReq.VendorName, fID, uID)
				if err == nil && id != uuid.Nil {
					sid := id.String()
					contactID = &sid
				}
			}

			var projectID *string
			if txReq.ProjectName != "" {
				id, err := s.ResolveProjectID(bgCtx, txReq.ProjectName, fID, uID)
				if err == nil && id != uuid.Nil {
					sid := id.String()
					projectID = &sid
				}
			}

			var locationID *string
			if txReq.LocationName != "" {
				id, err := s.ResolveLocationID(bgCtx, txReq.LocationName, fID, uID)
				if err == nil && id != uuid.Nil {
					sid := id.String()
					locationID = &sid
				}
			}

			createReq := dto.CreateTransactionRequest{
				Type:            txReq.Type,
				Amount:          txReq.Amount,
				Description:     txReq.Description,
				Title:           txReq.Title,
				WalletID:        walletID.String(),
				CategoryID:      *categoryID,
				PaymentMethodID: *paymentMethodID,
				ContactID:       *contactID,
				ProjectID:       *projectID,
				LocationID:      *locationID,
				TransactionDate: txReq.TransactionDate,
				FamilyID:        fID.String(),
				Tags:            txReq.Tags,
				Items:           txReq.Items,
			}

			// Create transaction
			_, err = s.Create(bgCtx, &createReq, uID)
			if err != nil {
				results[i] = dto.BulkImportResult{
					RowIndex: i + 1,
					Success:  false,
					Error:    err.Error(),
				}
				failedCount++
			} else {
				results[i] = dto.BulkImportResult{
					RowIndex: i + 1,
					Success:  true,
					// Data:     resp, // Omit data from result to keep notification payload small check?
				}
				successCount++
			}

			transactionTitle := "Transaction Created"
			transactionMessage := fmt.Sprintf("Transaction of %f for %s created successfully.", txReq.Amount, txReq.Description)
			err = s.notificationService.Create(bgCtx, uID, fID, transactionTitle, transactionMessage, "TRANSACTION_CREATED")
			if err != nil {
				s.logger.Errorf("Failed to send transaction notification: %v", err)
			}
		}

		// Send Notification
		title := "Bulk Import Completed"
		message := fmt.Sprintf("Imported %d transactions successfully. %d failed.", successCount, failedCount)
		// We can perhaps store the results details somewhere or send a link, but for now just summary.
		// If failedCount > 0, we might want to alert more visibly.
		
		err := s.notificationService.Create(bgCtx, uID, fID, title, message, "SYSTEM_ALERT")
		if err != nil {
			s.logger.Errorf("Failed to send bulk import notification: %v", err)
		}

	}(req.Transactions, familyID, userID)

	// Return immediate success indicating processing started
	return &dto.BulkImportTransactionsResponse{
		SuccessCount: 0,
		FailedCount:  0,
		Results:      []dto.BulkImportResult{}, 
		// Frontend should interpret 0/0 empty as "Processing" or we check HTTP 202 if we changed controller (but we kept it as is for now)
	}, nil
}
