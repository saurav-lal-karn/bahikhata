package dto

import "github.com/sauravkarn541/bahikhata/internal/model"

type CreateFamilyRequest struct {
	Name string `json:"name" binding:"required"`
}

type UpdateFamilySettingsRequest struct {
	Name             string `json:"name" binding:"required"`
	Currency         string `json:"currency" binding:"required"`
	BudgetAlerts     bool   `json:"budgetAlerts"`
	WeeklyReport     bool   `json:"weeklyReport"`
	HidePortfolio    bool   `json:"hidePortfolio"`
	RestrictDeletion bool   `json:"restrictDeletion"`
}

type FamilyResponse struct {
	ID               string `json:"id"`
	Name             string `json:"name"`
	Currency         string `json:"currency"`
	BudgetAlerts     bool   `json:"budgetAlerts"`
	WeeklyReport     bool   `json:"weeklyReport"`
	HidePortfolio    bool   `json:"hidePortfolio"`
	RestrictDeletion bool   `json:"restrictDeletion"`
}

func (req *CreateFamilyRequest) ToFamily() *model.Family {
	return &model.Family{
		Name:     req.Name,
		Currency: "INR", // Default currency
	}
}

func (req *UpdateFamilySettingsRequest) ToFamily() *model.Family {
	return &model.Family{
		Name:             req.Name,
		Currency:         req.Currency,
		BudgetAlerts:     req.BudgetAlerts,
		WeeklyReport:     req.WeeklyReport,
		HidePortfolio:    req.HidePortfolio,
		RestrictDeletion: req.RestrictDeletion,
	}
}

func ToFamilyResponse(family *model.Family) FamilyResponse {
	return FamilyResponse{
		ID:               family.ID.String(),
		Name:             family.Name,
		Currency:         family.Currency,
		BudgetAlerts:     family.BudgetAlerts,
		WeeklyReport:     family.WeeklyReport,
		HidePortfolio:    family.HidePortfolio,
		RestrictDeletion: family.RestrictDeletion,
	}
}
