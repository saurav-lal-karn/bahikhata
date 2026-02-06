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

type UpdateDebtRequest struct {
	FamilyID        uuid.UUID `json:"family_id"`
	Lender          string    `json:"lender" binding:"required"`
	TotalAmount     float64   `json:"total_amount" binding:"required"`
	RemainingAmount float64   `json:"remaining_amount" binding:"required"`
	InterestRate    float64   `json:"interest_rate" binding:"required"`
	DueDate         string    `json:"due_date" binding:"required"`
}

func (req *UpdateDebtRequest) ToModel(id uuid.UUID) (*model.Debt, error) {
	dueDate, err := time.Parse(time.RFC3339, req.DueDate)
	if err != nil {
		return nil, err
	}

	return &model.Debt{
		ID:              id,
		FamilyID:        req.FamilyID,
		Lender:          req.Lender,
		TotalAmount:     req.TotalAmount,
		RemainingAmount: req.RemainingAmount,
		InterestRate:    req.InterestRate,
		DueDate:         dueDate,
	}, nil
}

type DebtResponse struct {
	ID              uuid.UUID `json:"id"`
	FamilyID        uuid.UUID `json:"family_id"`
	Lender          string    `json:"lender"`
	TotalAmount     float64   `json:"total_amount"`
	RemainingAmount float64   `json:"remaining_amount"`
	InterestRate    float64   `json:"interest_rate"`
	DueDate         string    `json:"due_date"`

	LenderContact *ContactResponse `json:"lender_contact"`
}

func ToDebtResponse(debt *model.Debt) *DebtResponse {
	if debt == nil {
		return nil
	}
	return &DebtResponse{
		ID:              debt.ID,
		FamilyID:        debt.FamilyID,
		Lender:          debt.Lender,
		TotalAmount:     debt.TotalAmount,
		RemainingAmount: debt.RemainingAmount,
		InterestRate:    debt.InterestRate,
		DueDate:         debt.DueDate.Format(time.RFC3339),
		LenderContact:   ToContactResponse(debt.LenderContact),
	}
}

type CreateDebtRepaymentRequest struct {
	Amount        float64    `json:"amount" binding:"required"`
	TransactionID *uuid.UUID `json:"transaction_id,omitempty"`
	RepaymentDate string     `json:"repayment_date"`
}

func (req *CreateDebtRepaymentRequest) ToModel(debtID uuid.UUID) *model.DebtRepayment {
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

type DebtRepaymentResponse struct {
	ID            uuid.UUID `json:"id"`
	DebtID        uuid.UUID `json:"debt_id"`
	TransactionID *uuid.UUID `json:"transaction_id,omitempty"`
	Amount        float64   `json:"amount"`
	RepaymentDate string    `json:"repayment_date"`
}

func ToDebtRepaymentResponse(repayment *model.DebtRepayment) *DebtRepaymentResponse {
	if repayment == nil {
		return nil
	}
	return &DebtRepaymentResponse{
		ID:            repayment.ID,
		DebtID:        repayment.DebtID,
		TransactionID: repayment.TransactionID,
		Amount:        repayment.Amount,
		RepaymentDate: repayment.RepaymentDate.Format(time.RFC3339),
	}
}
