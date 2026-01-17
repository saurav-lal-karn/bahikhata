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
	CreateWallet(ctx context.Context, wallet *dto.CreateWalletRequest, created_by_id uuid.UUID) (*model.Wallet, error)
	GetWallets(ctx context.Context, family_id uuid.UUID, created_by_id uuid.UUID) ([]model.Wallet, error)
}

type walletService struct {
	walletRepo repository.WalletRepository
	walletTypeRepo repository.WalletTypeRepository
	familyRepo repository.FamilyRepository
}

func NewWalletService(walletRepo repository.WalletRepository, walletTypeRepo repository.WalletTypeRepository, familyRepo repository.FamilyRepository) WalletService {
	return &walletService{walletRepo: walletRepo, walletTypeRepo: walletTypeRepo, familyRepo: familyRepo}
}

func (s *walletService) CreateWallet(ctx context.Context, wallet *dto.CreateWalletRequest, created_by_id uuid.UUID) (*model.Wallet, error) {
	// Validate family id
	// Verify the family exists
	familyID := uuid.MustParse(wallet.FamilyID)
	_, err := s.familyRepo.GetFamilyById(ctx, familyID)
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
		walletType, err := s.walletTypeRepo.GetWalletTypeByName(ctx, wallet.CustomTypeName, familyID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Custom type not found, create a new one
				walletType, err = s.walletTypeRepo.Create(ctx, &model.WalletType{
					ID: uuid.New(),
					Name: wallet.CustomTypeName,
					FamilyID: familyID,
					CreatedByID: created_by_id,
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
		_, err := s.walletTypeRepo.GetWalletTypeById(ctx, walletTypeID)
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
		WalletID: wallet.WalletID,
		WalletTypeID: walletTypeID,
		FamilyID: familyID,
		UserID: created_by_id,
	}
	
	return s.walletRepo.Create(ctx, newWallet)
}

func (s *walletService) GetWallets(ctx context.Context, family_id uuid.UUID, created_by_id uuid.UUID) ([]model.Wallet, error) {
	return s.walletRepo.GetWallets(ctx, family_id, created_by_id)
}