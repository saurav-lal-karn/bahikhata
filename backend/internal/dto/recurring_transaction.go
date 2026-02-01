package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateRecurringTransactionRequest struct {
	FamilyID    *uuid.UUID `json:"family_id"`
	Name        string     `json:"name" binding:"required"`
	Amount      float64    `json:"amount" binding:"required"`
	Frequency   string     `json:"frequency" binding:"required"`
	NextDueDate string     `json:"next_due_date"`
	StartDate   string     `json:"start_date"`
	EndDate     string     `json:"end_date"`
	Type        string     `json:"type" binding:"required"`
	Description string     `json:"description"`
	CategoryID  *uuid.UUID `json:"category_id"`
	WalletID    *uuid.UUID `json:"wallet_id"`
}

func (req *CreateRecurringTransactionRequest) ToModel() (*model.RecurringTransaction, error) {
	var nextDueDate *time.Time
	if req.NextDueDate != "" {
		if t, err := time.Parse(time.RFC3339, req.NextDueDate); err == nil {
			nextDueDate = &t
		} else if t, err := time.Parse("2006-01-02", req.NextDueDate); err == nil {
			nextDueDate = &t
		}
	}

	startDate := time.Now()
	if req.StartDate != "" {
		if t, err := time.Parse(time.RFC3339, req.StartDate); err == nil {
			startDate = t
		}
	}

	return &model.RecurringTransaction{
		ID:          uuid.New(),
		FamilyID:    req.FamilyID,
		Name:        req.Name,
		Amount:      req.Amount,
		Frequency:   model.RecurringFrequency(req.Frequency),
		NextDueDate: nextDueDate,
		StartDate:   startDate,
		Type:        req.Type,
		Description: req.Description,
		CategoryID:  req.CategoryID,
		WalletID:    req.WalletID,
		IsActive:    true,
	}, nil
}

type AddRecurringInstanceRequest struct {
	TransactionID *uuid.UUID `json:"transaction_id,omitempty"`
	ExecutionDate string     `json:"execution_date"`
	Status        string     `json:"status" binding:"required"` // SUCCESS, FAILED
	ErrorMessage  *string    `json:"error_message,omitempty"`
}

func (req *AddRecurringInstanceRequest) ToModel(recurringID uuid.UUID) *model.RecurringInstance {
	executionDate := time.Now()
	if req.ExecutionDate != "" {
		if t, err := time.Parse(time.RFC3339, req.ExecutionDate); err == nil {
			executionDate = t
		}
	}
	return &model.RecurringInstance{
		ID:            uuid.New(),
		RecurringID:   recurringID,
		TransactionID: req.TransactionID,
		ExecutionDate: executionDate,
		Status:        req.Status,
		ErrorMessage:  req.ErrorMessage,
	}
}
