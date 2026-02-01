package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

// WalletRepository defines the interface for wallet data access operations.
type WalletRepository interface {
	// Create creates a new wallet in the database.
	Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error)

	// CreateWithTx creates a new wallet within a database transaction.
	CreateWithTx(ctx context.Context, tx *gorm.DB, wallet *model.Wallet) (*model.Wallet, error)

	// GetByID retrieves a wallet by its ID with related wallet type preloaded.
	GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error)

	// List retrieves wallets for a family/user with pagination support.
	// Returns the wallets, total count, and any error.
	List(ctx context.Context, familyID, userID uuid.UUID, page, pageSize int) ([]model.Wallet, int64, error)

	// Update updates an existing wallet and returns the updated wallet.
	Update(ctx context.Context, id uuid.UUID, wallet *model.Wallet) (*model.Wallet, error)

	// Delete soft-deletes a wallet by its ID.
	Delete(ctx context.Context, id uuid.UUID) error

	// ExistsByNameAndFamily checks if a wallet with the given name exists in the family.
	// excludeID is optional; if provided, excludes that wallet from the check (useful for updates).
	ExistsByNameAndFamily(ctx context.Context, name string, familyID uuid.UUID, excludeID *uuid.UUID) (bool, error)

	// UpdateBalance updates the balance of a wallet by a given delta.
	UpdateBalance(ctx context.Context, id uuid.UUID, delta float64) error

	// UpdateBalanceWithTx updates the balance of a wallet within a transaction.
	UpdateBalanceWithTx(ctx context.Context, tx *gorm.DB, id uuid.UUID, delta float64) error
}

type walletRepository struct {
	db *gorm.DB
}

// NewWalletRepository creates a new WalletRepository instance.
func NewWalletRepository(db *gorm.DB) WalletRepository {
	return &walletRepository{db: db}
}

// Create creates a new wallet in the database.
func (r *walletRepository) Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error) {
	if err := r.db.WithContext(ctx).Create(wallet).Error; err != nil {
		return nil, fmt.Errorf("wallet repository: create: %w", err)
	}
	return wallet, nil
}

// CreateWithTx creates a wallet within a transaction.
func (r *walletRepository) CreateWithTx(ctx context.Context, tx *gorm.DB, wallet *model.Wallet) (*model.Wallet, error) {
	if err := tx.WithContext(ctx).Create(wallet).Error; err != nil {
		return nil, fmt.Errorf("wallet repository: create with tx: %w", err)
	}
	return wallet, nil
}

// GetByID retrieves a wallet by ID with the WalletType preloaded.
func (r *walletRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error) {
	var wallet model.Wallet
	if err := r.db.WithContext(ctx).
		Preload("WalletType").
		First(&wallet, id).Error; err != nil {
		return nil, fmt.Errorf("wallet repository: get by id: %w", err)
	}
	return &wallet, nil
}

// List retrieves wallets for a family/user with pagination.
// Results are ordered by creation date (newest first).
func (r *walletRepository) List(ctx context.Context, familyID, userID uuid.UUID, page, pageSize int) ([]model.Wallet, int64, error) {
	var wallets []model.Wallet
	var total int64

	query := r.db.WithContext(ctx).
		Model(&model.Wallet{}).
		Where("family_id = ? AND user_id = ?", familyID, userID)

	// Get total count for pagination metadata
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("wallet repository: list count: %w", err)
	}

	// Calculate offset and get paginated results
	offset := (page - 1) * pageSize
	if err := query.
		Preload("WalletType").
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&wallets).Error; err != nil {
		return nil, 0, fmt.Errorf("wallet repository: list: %w", err)
	}

	return wallets, total, nil
}

// Update updates an existing wallet.
// Uses GORM Updates() to only update non-zero fields.
func (r *walletRepository) Update(ctx context.Context, id uuid.UUID, wallet *model.Wallet) (*model.Wallet, error) {
	result := r.db.WithContext(ctx).
		Model(&model.Wallet{}).
		Where("id = ?", id).
		Updates(wallet)

	if result.Error != nil {
		return nil, fmt.Errorf("wallet repository: update: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}

	// Fetch and return the updated wallet with preloaded relations
	return r.GetByID(ctx, id)
}

// Delete soft-deletes a wallet by its ID.
func (r *walletRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&model.Wallet{}, id)
	if result.Error != nil {
		return fmt.Errorf("wallet repository: delete: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// ExistsByNameAndFamily checks if a wallet with the given name exists in the family.
// Uses efficient query with SELECT 1 and LIMIT 1.
// If excludeID is provided, that wallet is excluded from the check (useful for update operations).
func (r *walletRepository) ExistsByNameAndFamily(ctx context.Context, name string, familyID uuid.UUID, excludeID *uuid.UUID) (bool, error) {
	query := r.db.WithContext(ctx).
		Model(&model.Wallet{}).
		Where("name = ? AND family_id = ?", name, familyID)

	// Exclude specific wallet ID (used during updates to allow keeping the same name)
	if excludeID != nil {
		query = query.Where("id != ?", *excludeID)
	}

	var count int64
	if err := query.Limit(1).Count(&count).Error; err != nil {
		return false, fmt.Errorf("wallet repository: exists check: %w", err)
	}

	return count > 0, nil
}

// UpdateBalance updates the balance of a wallet by a given delta.
func (r *walletRepository) UpdateBalance(ctx context.Context, id uuid.UUID, delta float64) error {
	return r.UpdateBalanceWithTx(ctx, r.db, id, delta)
}

// UpdateBalanceWithTx updates the balance of a wallet within a transaction.
func (r *walletRepository) UpdateBalanceWithTx(ctx context.Context, tx *gorm.DB, id uuid.UUID, delta float64) error {
	if err := tx.WithContext(ctx).Model(&model.Wallet{}).Where("id = ?", id).
		Update("balance", gorm.Expr("balance + ?", delta)).Error; err != nil {
		return fmt.Errorf("wallet repository: update balance: %w", err)
	}
	return nil
}
