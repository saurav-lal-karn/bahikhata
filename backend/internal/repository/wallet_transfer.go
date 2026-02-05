package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type WalletTransferRepository interface {
	Create(ctx context.Context, walletTransfer *model.WalletTransfer) error
	CreateWithTx(ctx context.Context, dbTx *gorm.DB, walletTransfer *model.WalletTransfer) error
	List(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletTransfer, error)
}

type walletTransferRepository struct{
	db *gorm.DB
}

func NewWalletTransferRepository(db *gorm.DB) WalletTransferRepository {
	return &walletTransferRepository{db: db}
}

func (w *walletTransferRepository) Create(ctx context.Context, walletTransfer *model.WalletTransfer) error {
	return w.db.WithContext(ctx).Create(walletTransfer).Error
}

func (w *walletTransferRepository) CreateWithTx(ctx context.Context, dbTx *gorm.DB, walletTransfer *model.WalletTransfer) error {
	return dbTx.WithContext(ctx).Create(walletTransfer).Error
}

func (w *walletTransferRepository) List(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletTransfer, error) {
	var walletTransfers []model.WalletTransfer
	err := w.db.WithContext(ctx).Where("family_id = ? OR user_id = ?", familyId, userId).Order("created_at DESC").Preload("FromWallet").Preload("ToWallet").Preload("User").Find(&walletTransfers).Error
	return walletTransfers, err
}

