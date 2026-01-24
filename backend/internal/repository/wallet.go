package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type WalletRepository interface {
	Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error)
	List(ctx context.Context, family_id uuid.UUID, created_by_id uuid.UUID) ([]model.Wallet, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error)
	Update(ctx context.Context, id uuid.UUID, wallet *model.Wallet) (*model.Wallet, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type walletRepository struct {
	db *gorm.DB
}

func NewWalletRepository(db *gorm.DB) WalletRepository {
	return &walletRepository{db: db}
}

func (r *walletRepository) Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error) {
	if err := r.db.WithContext(ctx).Create(wallet).Error; err != nil {
		return nil, err
	}
	return wallet, nil
}

func (r *walletRepository) List(ctx context.Context, family_id uuid.UUID, created_by_id uuid.UUID) ([]model.Wallet, error) {
	var wallets []model.Wallet
	if err := r.db.WithContext(ctx).Where("family_id = ? AND user_id = ?", family_id, created_by_id).Preload("WalletType").Find(&wallets).Error; err != nil {
		return nil, err
	}
	return wallets, nil
}

func (r *walletRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error) {
	var wallet model.Wallet
	if err := r.db.WithContext(ctx).Preload("WalletType").First(&wallet, id).Error; err != nil {
		return nil, err
	}
	return &wallet, nil
}

func (r *walletRepository) Update(ctx context.Context, id uuid.UUID, wallet *model.Wallet) (*model.Wallet, error) {
	wallet.ID = id
	if err := r.db.WithContext(ctx).Save(wallet).Error; err != nil {
		return nil, err
	}
	return wallet, nil
}

func (r *walletRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Wallet{}, id).Error
}