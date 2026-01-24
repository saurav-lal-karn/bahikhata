package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
)

type WalletService interface {
	Create(ctx context.Context, wallet *dto.CreateWalletRequest, created_by_id uuid.UUID) (*model.Wallet, error)
	List(ctx context.Context, family_id uuid.UUID, created_by_id uuid.UUID) ([]model.Wallet, error)
	GetByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*model.Wallet, error)
	Update(ctx context.Context,id uuid.UUID, wallet *dto.CreateWalletRequest, userID uuid.UUID) (*model.Wallet, error)
	Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
}

type walletService struct {
	walletRepo repository.WalletRepository
	walletTypeRepo repository.WalletTypeRepository
	familyRepo repository.FamilyRepository
}

func NewWalletService(walletRepo repository.WalletRepository, walletTypeRepo repository.WalletTypeRepository, familyRepo repository.FamilyRepository) WalletService {
	return &walletService{walletRepo: walletRepo, walletTypeRepo: walletTypeRepo, familyRepo: familyRepo}
}

func (s *walletService) Create(ctx context.Context, wallet *dto.CreateWalletRequest, created_by_id uuid.UUID) (*model.Wallet, error) {
	// Validate input
	if err := s.validateWalletRequest(wallet); err != nil {
		return nil, err
	}
	
	// Parse and validate family ID
	familyID, err := uuid.Parse(wallet.FamilyID)
	if err != nil {
		return nil, NewValidationError("invalid family_id format")
	}
	
	// Verify the family exists
	_, err = s.familyRepo.GetByID(ctx, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("family", familyID)
		}
		return nil, NewInternalError("verify family", err)
	}
	
	// Check for duplicate wallet name in family
	exists, err := s.walletRepo.ExistsByNameAndFamily(ctx, wallet.Name, familyID)
	if err != nil {
		return nil, NewInternalError("check wallet name", err)
	}
	if exists {
		return nil, NewConflictError(fmt.Sprintf("wallet with name '%s' already exists in family", wallet.Name))
	}

	// Resolve wallet type ID
	walletTypeID, err := s.resolveWalletTypeID(ctx, wallet, familyID, created_by_id)
	if err != nil {
		return nil, err
	}

	newWallet := &model.Wallet{
		ID: uuid.New(),
		Name: wallet.Name,
		StartingBalance: wallet.StartingBalance,
		Balance: wallet.StartingBalance, // Initialize balance with starting balance
		Currency: wallet.Currency,
		Description: wallet.Description,
		WalletIssuerName: wallet.WalletIssuerName,
		ProviderWalletID: wallet.ProviderWalletID,
		WalletTypeID: walletTypeID,
		FamilyID: familyID,
		UserID: created_by_id,
	}
	
	return s.walletRepo.Create(ctx, newWallet)
}

func (s *walletService) List(ctx context.Context, family_id uuid.UUID, created_by_id uuid.UUID) ([]model.Wallet, error) {
	return s.walletRepo.List(ctx, family_id, created_by_id)
}

func (s *walletService) GetByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*model.Wallet, error) {
	wallet, err := s.walletRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("wallet", id)
		}
		return nil, NewInternalError("get wallet", err)
	}
	
	// Check ownership
	if wallet.UserID != userID {
		return nil, NewUnauthorizedError("wallet does not belong to user")
	}
	
	return wallet, nil
}

func (s *walletService) Update(ctx context.Context, id uuid.UUID, wallet *dto.CreateWalletRequest, userID uuid.UUID) (*model.Wallet, error) {
	// Validate input
	if err := s.validateWalletRequest(wallet); err != nil {
		return nil, err
	}
	
	// 1. Get existing wallet
	existingWallet, err := s.walletRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("wallet", id)
		}
		return nil, NewInternalError("get wallet", err)
	}
	
	// 2. Check ownership
	if existingWallet.UserID != userID {
		return nil, NewUnauthorizedError("wallet does not belong to user")
	}

	// 3. Parse and validate family ID
	familyID, err := uuid.Parse(wallet.FamilyID)
	if err != nil {
		return nil, NewValidationError("invalid family_id format")
	}
	
	// 4. Resolve wallet type ID (handles both custom and existing types)
	walletTypeID, err := s.resolveWalletTypeID(ctx, wallet, familyID, userID)
	if err != nil {
		return nil, err
	}

	// 5. Apply updates - preserve ID, UserID, CreatedAt, and StartingBalance (historical data)
	existingWallet.Name = wallet.Name
	// Note: StartingBalance should NOT be updated - it's historical data
	existingWallet.Currency = wallet.Currency
	existingWallet.Description = wallet.Description
	existingWallet.WalletIssuerName = wallet.WalletIssuerName
	existingWallet.ProviderWalletID = wallet.ProviderWalletID
	existingWallet.WalletTypeID = walletTypeID
	existingWallet.FamilyID = familyID

	return s.walletRepo.Update(ctx, id, existingWallet)
}

func(s *walletService) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	// 1. Get existing wallet
	existingWallet, err := s.walletRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return NewNotFoundError("wallet", id)
		}
		return NewInternalError("get wallet", err)
	}

	// 2. Check ownership
	if existingWallet.UserID != userID {
		return NewUnauthorizedError("wallet does not belong to user")
	}

	return s.walletRepo.Delete(ctx, id)
}

// resolveWalletTypeID resolves the wallet type ID based on whether it's a custom type or existing type
func (s *walletService) resolveWalletTypeID(ctx context.Context, wallet *dto.CreateWalletRequest, familyID uuid.UUID, createdByID uuid.UUID) (uuid.UUID, error) {
	if wallet.IsCustomType {
		// Note: Custom type name validation already done in validateWalletRequest
		// Check if custom type already exists
		walletType, err := s.walletTypeRepo.GetByName(ctx, wallet.CustomTypeName, familyID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Custom type not found, create a new one
				walletType, err = s.walletTypeRepo.Create(ctx, &model.WalletType{
					ID: uuid.New(),
					Name: wallet.CustomTypeName,
					FamilyID: &familyID,
					CreatedByID: &createdByID,
					IsSystem: false,
				})
				if err != nil {
					return uuid.Nil, NewInternalError("create custom wallet type", err)
				}
			} else {
				return uuid.Nil, NewInternalError("get custom wallet type", err)
			}
		}
		return walletType.ID, nil
	}
	
	// Verify the existing wallet type
	walletTypeID, err := uuid.Parse(wallet.WalletTypeID)
	if err != nil {
		return uuid.Nil, NewValidationError("invalid wallet_type_id format")
	}
	
	_, err = s.walletTypeRepo.GetByID(ctx, walletTypeID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return uuid.Nil, NewNotFoundError("wallet type", walletTypeID)
		}
		return uuid.Nil, NewInternalError("verify wallet type", err)
	}
	
	return walletTypeID, nil
}

// validateWalletRequest validates wallet request business rules
func (s *walletService) validateWalletRequest(req *dto.CreateWalletRequest) error {
	// Note: Basic required field validation (Name, Currency, etc.) is handled by DTO binding tags
	
	// Conditional validation: IsCustomType logic
	if req.IsCustomType {
		if req.CustomTypeName == "" {
			return NewValidationError("custom type name is required when is_custom_type is true")
		}
	} else {
		if req.WalletTypeID == "" {
			return NewValidationError("wallet_type_id is required when is_custom_type is false")
		}
	}
	
	// Business rule validations
	if req.StartingBalance < 0 {
		return NewValidationError("starting balance cannot be negative")
	}
	return nil
}
