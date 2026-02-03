package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
)

type WalletTransferService interface {
	Create(ctx context.Context, walletTransfer *model.WalletTransfer) error
	List(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletTransfer, error)
}

type walletTransferService struct {
	db                       *gorm.DB
	walletTransferRepository repository.WalletTransferRepository
	walletRepository         repository.WalletRepository
	transactionRepository    repository.TransactionRepository
}

func NewWalletTransferService(
	db *gorm.DB,
	walletTransferRepository repository.WalletTransferRepository,
	walletRepository repository.WalletRepository,
	transactionRepository repository.TransactionRepository,
) WalletTransferService {
	return &walletTransferService{
		db:                       db,
		walletTransferRepository: walletTransferRepository,
		walletRepository:         walletRepository,
		transactionRepository:   transactionRepository,
	}
}

func (w *walletTransferService) Create(ctx context.Context, walletTransfer *model.WalletTransfer) error {
	walletFrom, err := w.walletRepository.GetByID(ctx, walletTransfer.FromWalletID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("from wallet not found")
		}
		return err
	}
	walletTo, err := w.walletRepository.GetByID(ctx, walletTransfer.ToWalletID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("to wallet not found")
		}
		return err
	}

	if walletFrom.FamilyID != walletTransfer.FamilyId || walletTo.FamilyID != walletTransfer.FamilyId {
		return fmt.Errorf("both wallets must belong to the same family")
	}
	if walletFrom.Balance < walletTransfer.Amount {
		return fmt.Errorf("insufficient balance in source wallet")
	}

	walletTransfer.FromWallet = walletFrom
	walletTransfer.ToWallet = walletTo

	err = w.db.WithContext(ctx).Transaction(func(dbTx *gorm.DB) error {
		if err := w.walletTransferRepository.CreateWithTx(ctx, dbTx, walletTransfer); err != nil {
			return err
		}
		if err := w.walletRepository.UpdateBalanceWithTx(ctx, dbTx, walletTransfer.FromWalletID, -walletTransfer.Amount); err != nil {
			return err
		}
		if err := w.walletRepository.UpdateBalanceWithTx(ctx, dbTx, walletTransfer.ToWalletID, walletTransfer.Amount); err != nil {
			return err
		}

		transferRefID := walletTransfer.ID
		userIDPtr := &walletTransfer.UserID

		outDesc := fmt.Sprintf("Transfer to %s", walletTo.Name)
		if walletTransfer.Remarks != "" {
			outDesc = fmt.Sprintf("%s - %s", outDesc, walletTransfer.Remarks)
		}
		outTx := &model.Transaction{
			Type:            model.CategoryTypeExpense,
			Amount:          walletTransfer.Amount,
			Description:    outDesc,
			WalletID:       walletTransfer.FromWalletID,
			TransactionDate: walletTransfer.Date,
			FamilyID:        walletTransfer.FamilyId,
			UserID:          userIDPtr,
			CreatedByID:     walletTransfer.UserID,
			TransferRefID:   &transferRefID,
		}
		if _, err := w.transactionRepository.CreateWithTx(ctx, dbTx, outTx); err != nil {
			return err
		}

		inDesc := fmt.Sprintf("Transfer from %s", walletFrom.Name)
		if walletTransfer.Remarks != "" {
			inDesc = fmt.Sprintf("%s - %s", inDesc, walletTransfer.Remarks)
		}
		inTx := &model.Transaction{
			Type:            model.CategoryTypeIncome,
			Amount:          walletTransfer.Amount,
			Description:    inDesc,
			WalletID:       walletTransfer.ToWalletID,
			TransactionDate: walletTransfer.Date,
			FamilyID:        walletTransfer.FamilyId,
			UserID:          userIDPtr,
			CreatedByID:     walletTransfer.UserID,
			TransferRefID:   &transferRefID,
		}
		if _, err := w.transactionRepository.CreateWithTx(ctx, dbTx, inTx); err != nil {
			return err
		}
		return nil
	})
	return err
}

func (w *walletTransferService) List(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.WalletTransfer, error) {
	return w.walletTransferRepository.List(ctx, familyId, userId)
}