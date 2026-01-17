package service

import (
	"context"

	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type WalletService interface {
	CreateWallet(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error)
}

type walletService struct {
	walletRepo repository.WalletRepository
	walletTypeRepo repository.WalletTypeRepository
}

func NewWalletService(walletRepo repository.WalletRepository, walletTypeRepo repository.WalletTypeRepository) WalletService {
	return &walletService{walletRepo: walletRepo, walletTypeRepo: walletTypeRepo}
}

func (s *walletService) CreateWallet(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error) {
	return s.walletRepo.Create(ctx, wallet)
}