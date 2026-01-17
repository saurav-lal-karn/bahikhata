package dto

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateWalletTransferRequest struct {
	FromWalletID string `json:"from_wallet_id"`
	ToWalletID   string `json:"to_wallet_id"`
	Amount       float64 `json:"amount"`
	Date         string  `json:"date"`
	Remarks      string  `json:"remarks"`
	FamilyId     string  `json:"family_id"`
}

func (req *CreateWalletTransferRequest) ToWalletTransfer() (*model.WalletTransfer, error) {
	fromWalletID, err := uuid.Parse(req.FromWalletID)
	if err != nil {
		return nil, err
	}
	toWalletID, err := uuid.Parse(req.ToWalletID)
	if err != nil {
		return nil, err
	}

	familyID, err := uuid.Parse(req.FamilyId)
	if err != nil {
		return nil, err
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, fmt.Errorf("Invalid date: %w", err)
	}

	return &model.WalletTransfer{
		ID:           uuid.New(),
		FromWalletID: fromWalletID,
		ToWalletID:   toWalletID,
		Amount:       req.Amount,
		Date:         date,
		Remarks:      req.Remarks,
		FamilyId:     familyID,
	}, nil
}