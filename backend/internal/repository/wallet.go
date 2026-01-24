package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type WalletRepository interface {
	Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error)
	CreateWithTx(ctx context.Context, tx *gorm.DB, wallet *model.Wallet) (*model.Wallet, error)
	List(ctx context.Context, family_id uuid.UUID, created_by_id uuid.UUID) ([]model.Wallet, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error)
	Update(ctx context.Context, id uuid.UUID, wallet *model.Wallet) (*model.Wallet, error)
	Delete(ctx context.Context, id uuid.UUID) error
	ExistsByNameAndFamily(ctx context.Context, name string, familyID uuid.UUID) (bool, error)
}

type walletRepository struct {
	db *gorm.DB
}

func NewWalletRepository(db *gorm.DB) WalletRepository {
	return &walletRepository{db: db}
}

func (r *walletRepository) Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error) {
	if err := r.db.WithContext(ctx).Create(wallet).Error; err != nil {
		return nil, fmt.Errorf("wallet repository: failed to create wallet %s: %w", wallet.ID, err)
	}
	return wallet, nil
}

// CreateWithTx creates a wallet within a transaction
func (r *walletRepository) CreateWithTx(ctx context.Context, tx *gorm.DB, wallet *model.Wallet) (*model.Wallet, error) {
	if err := tx.WithContext(ctx).Create(wallet).Error; err != nil {
		return nil, fmt.Errorf("wallet repository: failed to create wallet in transaction %s: %w", wallet.ID, err)
	}
	return wallet, nil
}

func (r *walletRepository) List(ctx context.Context, family_id uuid.UUID, created_by_id uuid.UUID) ([]model.Wallet, error) {
	var wallets []model.Wallet
	if err := r.db.WithContext(ctx).
		Where("family_id = ? AND user_id = ?", family_id, created_by_id).
		Preload("WalletType").
		Find(&wallets).Error; err != nil {
		return nil, fmt.Errorf("wallet repository: failed to list wallets for family %s: %w", family_id, err)
	}
	return wallets, nil
}

func (r *walletRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error) {
	var wallet model.Wallet
	if err := r.db.WithContext(ctx).Preload("WalletType").First(&wallet, id).Error; err != nil {
		return nil, fmt.Errorf("wallet repository: failed to get wallet %s: %w", id, err)
	}
	return &wallet, nil
}

func (r *walletRepository) Update(ctx context.Context, id uuid.UUID, wallet *model.Wallet) (*model.Wallet, error) {
	// Use Updates() instead of Save() to avoid updating zero values
	// This ensures we only update the fields that were explicitly set
	result := r.db.WithContext(ctx).Model(&model.Wallet{}).Where("id = ?", id).Updates(wallet)
	if result.Error != nil {
		return nil, fmt.Errorf("wallet repository: failed to update wallet %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	
	// Fetch and return the updated wallet
	return r.GetByID(ctx, id)
}

func (r *walletRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&model.Wallet{}, id)
	if result.Error != nil {
		return fmt.Errorf("wallet repository: failed to delete wallet %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// ExistsByNameAndFamily checks if a wallet with the given name exists in the family
func (r *walletRepository) ExistsByNameAndFamily(ctx context.Context, name string, familyID uuid.UUID) (bool, error) {
	// Use Limit(1) for better performance instead of counting all records
	var exists bool
	err := r.db.WithContext(ctx).
		Model(&model.Wallet{}).
		Select("1").
		Where("name = ? AND family_id = ?", name, familyID).
		Limit(1).
		Find(&exists).Error
	if err != nil {
		return false, fmt.Errorf("wallet repository: failed to check wallet existence: %w", err)
	}
	return exists, nil
}