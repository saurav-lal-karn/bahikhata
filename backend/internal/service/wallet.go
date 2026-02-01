package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
)

// WalletService defines the interface for wallet business operations.
type WalletService interface {
	// Create creates a new wallet for the user.
	// It validates the request, checks for duplicate names, and resolves the wallet type.
	Create(ctx context.Context, req *dto.CreateWalletRequest, userID uuid.UUID) (*dto.WalletResponse, error)

	// List retrieves wallets for a family with pagination.
	List(ctx context.Context, familyID, userID uuid.UUID, page, pageSize int) (*dto.WalletListResponse, error)

	// GetByID retrieves a wallet by its ID.
	// Returns ErrUnauthorized if the user doesn't own the wallet.
	GetByID(ctx context.Context, id, userID uuid.UUID) (*dto.WalletResponse, error)

	// Update updates an existing wallet.
	// Returns ErrUnauthorized if the user doesn't own the wallet.
	Update(ctx context.Context, id uuid.UUID, req *dto.UpdateWalletRequest, userID uuid.UUID) (*dto.WalletResponse, error)

	// Delete soft-deletes a wallet.
	// Returns ErrUnauthorized if the user doesn't own the wallet.
	Delete(ctx context.Context, id, userID uuid.UUID) error
}

type walletService struct {
	walletRepo     repository.WalletRepository
	walletTypeRepo repository.WalletTypeRepository
	familyRepo     repository.FamilyRepository
	logger         *logrus.Logger
}

// NewWalletService creates a new WalletService instance.
func NewWalletService(
	walletRepo repository.WalletRepository,
	walletTypeRepo repository.WalletTypeRepository,
	familyRepo repository.FamilyRepository,
	logger *logrus.Logger,
) WalletService {
	return &walletService{
		walletRepo:     walletRepo,
		walletTypeRepo: walletTypeRepo,
		familyRepo:     familyRepo,
		logger:         logger,
	}
}

// Create creates a new wallet for the user.
func (s *walletService) Create(ctx context.Context, req *dto.CreateWalletRequest, userID uuid.UUID) (*dto.WalletResponse, error) {
	s.logger.WithFields(logrus.Fields{
		"service":     "wallet",
		"user_id":     userID,
		"wallet_name": req.Name,
		"family_id":   req.FamilyID,
	}).Info("creating wallet")

	// 1. Validate request business rules
	if err := s.validateCreateRequest(req); err != nil {
		return nil, err
	}

	// 2. Parse and validate family ID
	familyID, err := uuid.Parse(req.FamilyID)
	if err != nil {
		return nil, NewValidationError("invalid family_id format")
	}

	// 3. Verify the family exists
	_, err = s.familyRepo.GetByID(ctx, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("family", familyID)
		}
		return nil, NewInternalError("verify family", err)
	}

	// 4. Check for duplicate wallet name in family
	exists, err := s.walletRepo.ExistsByNameAndFamily(ctx, req.Name, familyID, nil)
	if err != nil {
		return nil, NewInternalError("check wallet name", err)
	}
	if exists {
		return nil, NewConflictError(fmt.Sprintf("wallet with name '%s' already exists in this family", req.Name))
	}

	// 5. Resolve wallet type ID (create custom type if needed)
	walletTypeID, err := s.resolveWalletTypeID(ctx, req.IsCustomType, req.WalletTypeID, req.CustomTypeName, familyID, userID)
	if err != nil {
		return nil, err
	}

	// 6. Create the wallet
	wallet := &model.Wallet{
		ID:               uuid.New(),
		Name:             req.Name,
		StartingBalance:  req.StartingBalance,
		Balance:          req.StartingBalance, // Initialize balance with starting balance
		Currency:         req.Currency,
		Description:      req.Description,
		WalletIssuerName: req.WalletIssuerName,
		ProviderWalletID: req.ProviderWalletID,
		WalletTypeID:     walletTypeID,
		FamilyID:         familyID,
		UserID:           userID,
	}

	created, err := s.walletRepo.Create(ctx, wallet)
	if err != nil {
		s.logger.WithFields(logrus.Fields{
			"service": "wallet",
			"user_id": userID,
			"error":   err,
		}).Error("failed to create wallet")
		return nil, NewInternalError("create wallet", err)
	}

	s.logger.WithFields(logrus.Fields{
		"service":   "wallet",
		"wallet_id": created.ID,
		"user_id":   userID,
	}).Info("wallet created successfully")

	// 7. Fetch with preloaded relations for response
	wallet, err = s.walletRepo.GetByID(ctx, created.ID)
	if err != nil {
		return nil, NewInternalError("fetch created wallet", err)
	}

	response := dto.ToWalletResponse(wallet)
	return &response, nil
}

// List retrieves wallets for a family with pagination.
func (s *walletService) List(ctx context.Context, familyID, userID uuid.UUID, page, pageSize int) (*dto.WalletListResponse, error) {
	s.logger.WithFields(logrus.Fields{
		"service":   "wallet",
		"family_id": familyID,
		"user_id":   userID,
		"page":      page,
		"page_size": pageSize,
	}).Debug("listing wallets")

	wallets, total, err := s.walletRepo.List(ctx, familyID, userID, page, pageSize)
	if err != nil {
		s.logger.WithFields(logrus.Fields{
			"service":   "wallet",
			"family_id": familyID,
			"user_id":   userID,
			"error":     err,
		}).Error("failed to list wallets")
		return nil, NewInternalError("list wallets", err)
	}

	response := dto.ToWalletListResponse(wallets, total, page, pageSize)
	return &response, nil
}

// GetByID retrieves a wallet by its ID.
func (s *walletService) GetByID(ctx context.Context, id, userID uuid.UUID) (*dto.WalletResponse, error) {
	wallet, err := s.walletRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("wallet", id)
		}
		return nil, NewInternalError("get wallet", err)
	}

	// Check ownership
	if err := s.checkOwnership(wallet, userID); err != nil {
		return nil, err
	}

	response := dto.ToWalletResponse(wallet)
	return &response, nil
}

// Update updates an existing wallet.
func (s *walletService) Update(ctx context.Context, id uuid.UUID, req *dto.UpdateWalletRequest, userID uuid.UUID) (*dto.WalletResponse, error) {
	s.logger.WithFields(logrus.Fields{
		"service":   "wallet",
		"wallet_id": id,
		"user_id":   userID,
	}).Info("updating wallet")

	// 1. Validate request business rules
	if err := s.validateUpdateRequest(req); err != nil {
		return nil, err
	}

	// 2. Get existing wallet
	existingWallet, err := s.walletRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("wallet", id)
		}
		return nil, NewInternalError("get wallet", err)
	}

	// 3. Check ownership
	if err := s.checkOwnership(existingWallet, userID); err != nil {
		return nil, err
	}

	// 4. Check for duplicate wallet name in family (excluding current wallet)
	exists, err := s.walletRepo.ExistsByNameAndFamily(ctx, req.Name, existingWallet.FamilyID, &id)
	if err != nil {
		return nil, NewInternalError("check wallet name", err)
	}
	if exists {
		return nil, NewConflictError(fmt.Sprintf("wallet with name '%s' already exists in this family", req.Name))
	}

	// 5. Resolve wallet type ID (handles both custom and existing types)
	walletTypeID, err := s.resolveWalletTypeID(ctx, req.IsCustomType, req.WalletTypeID, req.CustomTypeName, existingWallet.FamilyID, userID)
	if err != nil {
		return nil, err
	}

	// 6. Apply updates - preserve ID, UserID, FamilyID, CreatedAt, and StartingBalance (historical data)
	existingWallet.Name = req.Name
	existingWallet.Currency = req.Currency
	existingWallet.Description = req.Description
	existingWallet.WalletIssuerName = req.WalletIssuerName
	existingWallet.ProviderWalletID = req.ProviderWalletID
	existingWallet.WalletTypeID = walletTypeID

	updated, err := s.walletRepo.Update(ctx, id, existingWallet)
	if err != nil {
		s.logger.WithFields(logrus.Fields{
			"service":   "wallet",
			"wallet_id": id,
			"user_id":   userID,
			"error":     err,
		}).Error("failed to update wallet")
		return nil, NewInternalError("update wallet", err)
	}

	s.logger.WithFields(logrus.Fields{
		"service":   "wallet",
		"wallet_id": id,
		"user_id":   userID,
	}).Info("wallet updated successfully")

	response := dto.ToWalletResponse(updated)
	return &response, nil
}

// Delete soft-deletes a wallet.
func (s *walletService) Delete(ctx context.Context, id, userID uuid.UUID) error {
	s.logger.WithFields(logrus.Fields{
		"service":   "wallet",
		"wallet_id": id,
		"user_id":   userID,
	}).Info("deleting wallet")

	// 1. Get existing wallet
	existingWallet, err := s.walletRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return NewNotFoundError("wallet", id)
		}
		return NewInternalError("get wallet", err)
	}

	// 2. Check ownership
	if err := s.checkOwnership(existingWallet, userID); err != nil {
		return err
	}

	// 3. Delete the wallet
	if err := s.walletRepo.Delete(ctx, id); err != nil {
		s.logger.WithFields(logrus.Fields{
			"service":   "wallet",
			"wallet_id": id,
			"user_id":   userID,
			"error":     err,
		}).Error("failed to delete wallet")
		return NewInternalError("delete wallet", err)
	}

	s.logger.WithFields(logrus.Fields{
		"service":   "wallet",
		"wallet_id": id,
		"user_id":   userID,
	}).Info("wallet deleted successfully")

	return nil
}

// validateCreateRequest validates the create wallet request business rules.
func (s *walletService) validateCreateRequest(req *dto.CreateWalletRequest) error {
	// Conditional validation: IsCustomType logic
	if req.IsCustomType {
		if req.CustomTypeName == "" {
			return NewValidationError("custom_type_name is required when is_custom_type is true")
		}
	} else {
		if req.WalletTypeID == "" {
			return NewValidationError("wallet_type_id is required when is_custom_type is false")
		}
	}

	// Business rule: starting balance cannot be negative
	if req.StartingBalance < 0 {
		return NewValidationError("starting_balance cannot be negative")
	}

	return nil
}

// validateUpdateRequest validates the update wallet request business rules.
func (s *walletService) validateUpdateRequest(req *dto.UpdateWalletRequest) error {
	// Conditional validation: IsCustomType logic
	if req.IsCustomType {
		if req.CustomTypeName == "" {
			return NewValidationError("custom_type_name is required when is_custom_type is true")
		}
	} else {
		if req.WalletTypeID == "" {
			return NewValidationError("wallet_type_id is required when is_custom_type is false")
		}
	}

	return nil
}

// resolveWalletTypeID resolves or creates the wallet type based on request parameters.
func (s *walletService) resolveWalletTypeID(ctx context.Context, isCustom bool, typeID, customName string, familyID, userID uuid.UUID) (uuid.UUID, error) {
	if isCustom {
		// Check if custom type already exists
		walletType, err := s.walletTypeRepo.GetByName(ctx, customName, familyID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Create new custom type
				walletType, err = s.walletTypeRepo.Create(ctx, &model.WalletType{
					ID:          uuid.New(),
					Name:        customName,
					FamilyID:    &familyID,
					CreatedByID: &userID,
					IsSystem:    false,
				})
				if err != nil {
					return uuid.Nil, NewInternalError("create custom wallet type", err)
				}
				s.logger.WithFields(logrus.Fields{
					"service":          "wallet",
					"wallet_type_id":   walletType.ID,
					"wallet_type_name": customName,
				}).Info("created custom wallet type")
			} else {
				return uuid.Nil, NewInternalError("check custom wallet type", err)
			}
		}
		return walletType.ID, nil
	}

	// Validate existing wallet type
	walletTypeUUID, err := uuid.Parse(typeID)
	if err != nil {
		return uuid.Nil, NewValidationError("invalid wallet_type_id format")
	}

	_, err = s.walletTypeRepo.GetByID(ctx, walletTypeUUID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return uuid.Nil, NewNotFoundError("wallet_type", walletTypeUUID)
		}
		return uuid.Nil, NewInternalError("verify wallet type", err)
	}

	return walletTypeUUID, nil
}

// checkOwnership verifies that the user owns the wallet.
func (s *walletService) checkOwnership(wallet *model.Wallet, userID uuid.UUID) error {
	if wallet.UserID != userID {
		s.logger.WithFields(logrus.Fields{
			"service":         "wallet",
			"wallet_id":       wallet.ID,
			"wallet_owner":    wallet.UserID,
			"requesting_user": userID,
		}).Warn("unauthorized wallet access attempt")
		return NewUnauthorizedError("you don't have permission to access this wallet")
	}
	return nil
}
