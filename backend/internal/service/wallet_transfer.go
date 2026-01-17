package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type WalletTransferService interface {
	CreateWalletTransfer(ctx context.Context, walletTransfer *model.WalletTransfer) error
	ListWalletTransfers(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletTransfer, error)
}

type walletTransferService struct {
	walletTransferRepository repository.WalletTransferRepository
	walletRepository repository.WalletRepository
}

func NewWalletTransferService(walletTransferRepository repository.WalletTransferRepository, walletRepository repository.WalletRepository) WalletTransferService {
	return &walletTransferService{walletTransferRepository: walletTransferRepository, walletRepository: walletRepository}
}

func (w *walletTransferService) CreateWalletTransfer(ctx context.Context, walletTransfer *model.WalletTransfer) error {
	walletFrom, err := w.walletRepository.GetWalletById(ctx, walletTransfer.FromWalletID)
	if err != nil {
		return err
	}
	walletTo, err := w.walletRepository.GetWalletById(ctx, walletTransfer.ToWalletID)
	if err != nil {
		return err
	}
	walletTransfer.FromWallet = walletFrom
	walletTransfer.ToWallet = walletTo
	return w.walletTransferRepository.CreateWalletTransfer(ctx, walletTransfer)
}

func (w *walletTransferService) ListWalletTransfers(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletTransfer, error) {
	return w.walletTransferRepository.ListWalletTransfers(ctx, familyId, userId)
}