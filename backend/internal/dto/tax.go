package dto

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateTaxDocumentRequest struct {
	FamilyID *uuid.UUID `json:"family_id"`
	Name     string     `json:"name" binding:"required"`
	Category string     `json:"category" binding:"required"`
	Year     string     `json:"year" binding:"required"`
	FileURL  string     `json:"file_url"`
	Remarks  string     `json:"remarks"`
}

func (req *CreateTaxDocumentRequest) ToModel() *model.TaxDocument {
	return &model.TaxDocument{
		ID:       uuid.New(),
		FamilyID: req.FamilyID,
		Name:     req.Name,
		Category: req.Category,
		Year:     req.Year,
		FileURL:  req.FileURL,
		Remarks:  req.Remarks,
	}
}

type CreateTaxDeductionRequest struct {
	FamilyID *uuid.UUID `json:"family_id"`
	Name     string     `json:"name" binding:"required"`
	Amount   float64    `json:"amount" binding:"required"`
	MaxLimit float64    `json:"max_limit" binding:"required"`
	Category string     `json:"category" binding:"required"` // 80C
	Year     string     `json:"year" binding:"required"`
}

func (req *CreateTaxDeductionRequest) ToModel() *model.TaxDeduction {
	return &model.TaxDeduction{
		ID:       uuid.New(),
		FamilyID: req.FamilyID,
		Name:     req.Name,
		Amount:   req.Amount,
		MaxLimit: req.MaxLimit,
		Category: req.Category,
		Year:     req.Year,
	}
}
