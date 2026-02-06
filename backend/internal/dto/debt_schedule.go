package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateDebtScheduleRequest struct {
	DueDate           string  `json:"due_date" binding:"required"`
	InstallmentNumber int     `json:"installment_number"`
	PrincipalAmount   float64 `json:"principal_amount"`
	InterestAmount    float64 `json:"interest_amount"`
	TotalInstallment  float64 `json:"total_installment" binding:"required"`
	Status            string  `json:"status"` // PENDING, PAID
}

func (req *CreateDebtScheduleRequest) ToModel(debtID uuid.UUID) *model.DebtSchedule {
	dueDate, err := time.Parse(time.RFC3339, req.DueDate)
	if err != nil {
		dueDate, _ = time.Parse("2006-01-02", req.DueDate)
	}

	status := req.Status
	if status == "" {
		status = "PENDING"
	}

	return &model.DebtSchedule{
		ID:                uuid.New(),
		DebtID:            debtID,
		DueDate:           dueDate,
		InstallmentNumber: req.InstallmentNumber,
		PrincipalAmount:   req.PrincipalAmount,
		InterestAmount:    req.InterestAmount,
		TotalInstallment:  req.TotalInstallment,
		RemainingBalance:  0, // Will be calculated by trigger or service logic if needed, or 0 for now
		Status:            status,
	}
}

type UpdateDebtScheduleStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

type DebtScheduleResponse struct {
	ID                uuid.UUID `json:"id"`
	DebtID            uuid.UUID `json:"debt_id"`
	DueDate           string    `json:"due_date"`
	InstallmentNumber int       `json:"installment_number"`
	PrincipalAmount   float64   `json:"principal_amount"`
	InterestAmount    float64   `json:"interest_amount"`
	TotalInstallment  float64   `json:"total_installment"`
	RemainingBalance  float64   `json:"remaining_balance"`
	Status            string    `json:"status"`
}

func ToDebtScheduleResponse(schedule *model.DebtSchedule) *DebtScheduleResponse {
	if schedule == nil {
		return nil
	}
	return &DebtScheduleResponse{
		ID:                schedule.ID,
		DebtID:            schedule.DebtID,
		DueDate:           schedule.DueDate.Format(time.RFC3339),
		InstallmentNumber: schedule.InstallmentNumber,
		PrincipalAmount:   schedule.PrincipalAmount,
		InterestAmount:    schedule.InterestAmount,
		TotalInstallment:  schedule.TotalInstallment,
		RemainingBalance:  schedule.RemainingBalance,
		Status:            schedule.Status,
	}
}