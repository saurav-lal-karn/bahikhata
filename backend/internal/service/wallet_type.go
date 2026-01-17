package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type WalletTypeService interface {
	CreateWalletType(ctx context.Context, walletType *model.WalletType) error
	GetWalletTypes(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletType, error)
}

type walletTypeService struct {
	repo repository.WalletTypeRepository
}

func NewWalletTypeService(repo repository.WalletTypeRepository) WalletTypeService {
	return &walletTypeService{repo: repo}
}

func (s *walletTypeService) CreateWalletType(ctx context.Context, walletType *model.WalletType) error {
	_, err := s.repo.Create(ctx, walletType)
	return err
}

func (s *walletTypeService) GetWalletTypes(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletType, error) {
	walletTypes, err := s.repo.List(ctx, familyId, userId)
	if err != nil {
		return nil, err
	}
	return walletTypes, nil
}