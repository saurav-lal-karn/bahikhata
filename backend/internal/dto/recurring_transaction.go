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
	NextDueDate string     `json:"next_due_date" binding:"required"`
	Type        string     `json:"type" binding:"required"`
}

func (req *CreateRecurringTransactionRequest) ToModel() (*model.RecurringTransaction, error) {
	dueDate, err := time.Parse(time.RFC3339, req.NextDueDate)
	if err != nil {
		return nil, err
	}

	return &model.RecurringTransaction{
		ID:          uuid.New(),
		FamilyID:    req.FamilyID,
		Name:        req.Name,
		Amount:      req.Amount,
		Frequency:   req.Frequency,
		NextDueDate: dueDate,
		Type:        req.Type,
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
