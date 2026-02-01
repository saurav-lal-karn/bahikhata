package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateInvestmentRequest struct {
	FamilyID     *uuid.UUID `json:"family_id"`
	Name         string     `json:"name" binding:"required"`
	Type         string     `json:"type" binding:"required"`
	Quantity     float64    `json:"quantity" binding:"required"`
	AvgBuyPrice  float64    `json:"avg_buy_price" binding:"required"`
	CurrentPrice float64    `json:"current_price" binding:"required"`
}

func (req *CreateInvestmentRequest) ToModel() *model.Investment {
	return &model.Investment{
		ID:           uuid.New(),
		FamilyID:     req.FamilyID,
		Name:         req.Name,
		Type:         req.Type,
		Quantity:     req.Quantity,
		AvgBuyPrice:  req.AvgBuyPrice,
		CurrentPrice: req.CurrentPrice,
	}
}

type AddInvestmentTransactionRequest struct {
	Type            string     `json:"type" binding:"required"` // BUY, SELL, DIVIDEND
	Quantity        float64    `json:"quantity" binding:"required"`
	PricePerUnit    float64    `json:"price_per_unit" binding:"required"`
	TransactionID   *uuid.UUID `json:"transaction_id,omitempty"`
	TransactionDate string     `json:"transaction_date"`
}

func (req *AddInvestmentTransactionRequest) ToModel(investmentID uuid.UUID) *model.InvestmentTransaction {
	transactionDate := time.Now()
	if req.TransactionDate != "" {
		if t, err := time.Parse(time.RFC3339, req.TransactionDate); err == nil {
			transactionDate = t
		}
	}
	return &model.InvestmentTransaction{
		ID:              uuid.New(),
		InvestmentID:    investmentID,
		TransactionID:   req.TransactionID,
		Type:            model.InvestmentTransactionType(req.Type),
		Quantity:        req.Quantity,
		PricePerUnit:    req.PricePerUnit,
		TransactionDate: transactionDate,
	}
}
