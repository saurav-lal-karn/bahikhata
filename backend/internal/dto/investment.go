package dto

import (
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
