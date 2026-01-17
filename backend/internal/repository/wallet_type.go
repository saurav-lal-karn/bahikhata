package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type WalletTypeRepository interface {
	Create(ctx context.Context, walletType *model.WalletType) (*model.WalletType, error)
	List(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletType, error)
}

type walletTypeRepository struct {
	db *gorm.DB
}

func NewWalletTypeRepository(db *gorm.DB) WalletTypeRepository {
	return &walletTypeRepository{db: db}
}

func (r *walletTypeRepository) Create(ctx context.Context, walletType *model.WalletType) (*model.WalletType, error) {
	if err := r.db.WithContext(ctx).Create(walletType).Error; err != nil {
		return nil, err
	}
	return walletType, nil
}

func (r *walletTypeRepository) List(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletType, error) {
	var walletTypes []model.WalletType
	if err := r.db.WithContext(ctx).Where("is_system = ? OR (family_id = ? AND created_by_id = ?)", true, familyId, userId).Find(&walletTypes).Error; err != nil {
		return nil, err
	}
	return walletTypes, nil
}

