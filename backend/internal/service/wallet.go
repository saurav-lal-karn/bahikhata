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
	GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error)
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
	// Validate family id
	// Verify the family exists
	familyID := uuid.MustParse(wallet.FamilyID)
	_, err := s.familyRepo.GetByID(ctx, familyID)
	if err != nil {
		return nil, fmt.Errorf("Family not found: %w", err)
	}

	var walletTypeID uuid.UUID
	if wallet.IsCustomType {
		// Check if custom type name is provided
		if wallet.CustomTypeName == "" {
			return nil, fmt.Errorf("Custom type name is required when is_custom_type is true")
		}
		// Check if custom type exists
		walletType, err := s.walletTypeRepo.GetByName(ctx, wallet.CustomTypeName, familyID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Custom type not found, create a new one
				walletType, err = s.walletTypeRepo.Create(ctx, &model.WalletType{
					ID: uuid.New(),
					Name: wallet.CustomTypeName,
					FamilyID: &familyID,
					CreatedByID: &created_by_id,
					IsSystem: false,
				})
				if err != nil {
					return nil, fmt.Errorf("Failed to create custom type: %w", err)
				}
			} else {
				// Some other error occurred
				return nil, fmt.Errorf("Failed to get custom type: %w", err)
			}
		}
		walletTypeID = walletType.ID
	} else {
		// Verify the wallet type exists
		walletTypeID = uuid.MustParse(wallet.WalletTypeID)
		_, err := s.walletTypeRepo.GetByID(ctx, walletTypeID)
		if err != nil {
			return nil, fmt.Errorf("Wallet type not found: %w", err)
		}
	}

	newWallet := &model.Wallet{
		ID: uuid.New(),
		Name: wallet.Name,
		StartingBalance: wallet.StartingBalance,
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

func(s *walletService) GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error) {
	return s.walletRepo.GetByID(ctx, id)
}

func(s *walletService) Update(ctx context.Context, id uuid.UUID, wallet *dto.CreateWalletRequest, userID uuid.UUID) (*model.Wallet, error) {
	// 1. Get existing wallet
	existingWallet, err := s.walletRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch wallet: %w", err)
	}
	
	// 2. Check ownership
	if existingWallet.UserID != userID {
		return nil, fmt.Errorf("unauthorized: wallet does not belong to user")
	}

	// 3. Update fields (re-using logic from CreateWallet or manual assignment)
	// We parse the new values
	updatedData, err := wallet.ToModel()
	if err != nil {
		return nil, err
	}

	// Apply updates to existing wallet to preserve ID, CreatedAt, UserID etc.
	existingWallet.Name = updatedData.Name
	existingWallet.StartingBalance = updatedData.StartingBalance
	existingWallet.Currency = updatedData.Currency
	existingWallet.Description = updatedData.Description
	existingWallet.WalletIssuerName = updatedData.WalletIssuerName
	existingWallet.ProviderWalletID = updatedData.ProviderWalletID
	existingWallet.WalletTypeID = updatedData.WalletTypeID
	existingWallet.FamilyID = updatedData.FamilyID 
	
	// Custom type logic (if changed) is a bit complex. For now assuming simple update.
	// existingWallet.UserID is already preserved.

	return s.walletRepo.Update(ctx, id, existingWallet)
}

func(s *walletService) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	// 1. Get existing wallet
	existingWallet, err := s.walletRepo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to fetch wallet: %w", err)
	}

	// 2. Check ownership
	if existingWallet.UserID != userID {
		return fmt.Errorf("unauthorized: wallet does not belong to user")
	}

	return s.walletRepo.Delete(ctx, id)
}
