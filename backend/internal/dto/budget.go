package dto

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateBudgetRequest struct {
	CategoryId uuid.UUID `json:"category_id" binding:"required"`
	AmountLimit     float64   `json:"amount_limit" binding:"required"`
	FamilyID   uuid.UUID `json:"family_id" binding:"required"`
	Period string `json:"period"`
	AlertThreshold float64 `json:"alert_threshold"`
}

func (req *CreateBudgetRequest) ToBudget() (*model.Budget) {
	return &model.Budget{
		ID: uuid.New(),
		CategoryID: &req.CategoryId,
		AmountLimit: req.AmountLimit,
		FamilyID: &req.FamilyID,
		Period: req.Period,
		AlertThreshold: req.AlertThreshold,
	}
}
