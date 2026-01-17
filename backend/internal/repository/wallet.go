package repository

import (
	"context"

	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type WalletRepository interface {
	Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error)
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