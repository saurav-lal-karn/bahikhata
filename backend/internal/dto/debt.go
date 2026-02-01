package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateDebtRequest struct {
	FamilyID        uuid.UUID `json:"family_id"`
	Lender          string    `json:"lender" binding:"required"`
	TotalAmount     float64   `json:"total_amount" binding:"required"`
	RemainingAmount float64   `json:"remaining_amount" binding:"required"`
	InterestRate    float64   `json:"interest_rate" binding:"required"`
	DueDate         string    `json:"due_date" binding:"required"`
}

func (req *CreateDebtRequest) ToModel() (*model.Debt, error) {
	dueDate, err := time.Parse(time.RFC3339, req.DueDate)
	if err != nil {
		return nil, err
	}

	return &model.Debt{
		ID:              uuid.New(),
		FamilyID:        req.FamilyID,
		Lender:          req.Lender,
		TotalAmount:     req.TotalAmount,
		RemainingAmount: req.RemainingAmount,
		InterestRate:    req.InterestRate,
		DueDate:         dueDate,
	}, nil
}

type AddDebtRepaymentRequest struct {
	Amount        float64    `json:"amount" binding:"required"`
	TransactionID *uuid.UUID `json:"transaction_id,omitempty"`
	RepaymentDate string     `json:"repayment_date"`
}

func (req *AddDebtRepaymentRequest) ToModel(debtID uuid.UUID) *model.DebtRepayment {
	repaymentDate := time.Now()
	if req.RepaymentDate != "" {
		if t, err := time.Parse(time.RFC3339, req.RepaymentDate); err == nil {
			repaymentDate = t
		}
	}
	return &model.DebtRepayment{
		ID:            uuid.New(),
		DebtID:        debtID,
		TransactionID: req.TransactionID,
		Amount:        req.Amount,
		RepaymentDate: repaymentDate,
	}
}
