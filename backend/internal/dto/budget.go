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

func (req *CreateBudgetRequest) ToModel() (*model.Budget) {
	return &model.Budget{
		ID: uuid.New(),
		CategoryID: req.CategoryId,
		AmountLimit: req.AmountLimit,
		FamilyID: req.FamilyID,
		Period: req.Period,
		AlertThreshold: req.AlertThreshold,
	}
}

type UpdateBudgetRequest struct {
	CategoryID uuid.UUID `json:"category_id" binding:"required"`
	AmountLimit float64 `json:"amount_limit" binding:"required"`
	FamilyID uuid.UUID `json:"family_id" binding:"required"`
	Period string `json:"period"`
	AlertThreshold float64 `json:"alert_threshold"`
}

func (req *UpdateBudgetRequest) ToModel(id uuid.UUID) (*model.Budget) {
	return &model.Budget{
		ID: id,
		CategoryID: req.CategoryID,
		AmountLimit: req.AmountLimit,
		FamilyID: req.FamilyID,
		Period: req.Period,
		AlertThreshold: req.AlertThreshold,
	}
}

type BudgetResponse struct {
	ID uuid.UUID `json:"id"`
	CategoryID uuid.UUID `json:"category_id"`
	AmountLimit float64 `json:"amount_limit"`
	FamilyID uuid.UUID `json:"family_id"`
	Period string `json:"period"`
	AlertThreshold float64 `json:"alert_threshold"`
}

func ToBudgetResponse(budget *model.Budget) *BudgetResponse {
	if budget == nil {
		return nil
	}
	return &BudgetResponse{
		ID: budget.ID,
		CategoryID: budget.CategoryID,
		AmountLimit: budget.AmountLimit,
		FamilyID: budget.FamilyID,
		Period: budget.Period,
		AlertThreshold: budget.AlertThreshold,
	}
}