package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type SplitParticipantRequest struct {
	UserID    *uuid.UUID `json:"user_id,omitempty"`
	ContactID *uuid.UUID `json:"contact_id,omitempty"`
	Amount    float64    `json:"amount" binding:"required"`
}

type CreateSplitRequest struct {
	TransactionID uuid.UUID                 `json:"transaction_id" binding:"required"`
	TotalAmount   float64                   `json:"total_amount" binding:"required"`
	SplitMethod   model.SplitMethod         `json:"split_method" binding:"required"`
	Participants  []SplitParticipantRequest `json:"participants" binding:"required,min=1"`
}

type SplitParticipantResponse struct {
	ID         uuid.UUID  `json:"id"`
	UserID     *uuid.UUID `json:"user_id,omitempty"`
	ContactID  *uuid.UUID `json:"contact_id,omitempty"`
	AmountOwed float64    `json:"amount_owed"`
	AmountPaid float64    `json:"amount_paid"`
	Status     string     `json:"status"`
}

type ExpenseSplitResponse struct {
	ID            uuid.UUID                  `json:"id"`
	TransactionID uuid.UUID                  `json:"transaction_id"`
	TotalAmount   float64                    `json:"total_amount"`
	SplitMethod   string                     `json:"split_method"`
	Participants  []SplitParticipantResponse `json:"participants"`
}

func ToExpenseSplitResponse(m *model.ExpenseSplit) *ExpenseSplitResponse {
	if m == nil {
		return nil
	}
	res := &ExpenseSplitResponse{
		ID:            m.ID,
		TransactionID: m.TransactionID,
		TotalAmount:   m.TotalAmount,
		SplitMethod:   string(m.SplitMethod),
		Participants:  make([]SplitParticipantResponse, len(m.Participants)),
	}
	for i, p := range m.Participants {
		res.Participants[i] = SplitParticipantResponse{
			ID:         p.ID,
			UserID:     p.UserID,
			ContactID:  p.ContactID,
			AmountOwed: p.AmountOwed,
			AmountPaid: p.AmountPaid,
			Status:     string(p.Status),
		}
	}
	return res
}

type CreateSplitSettlementRequest struct {
	ParticipantID uuid.UUID  `json:"participant_id" binding:"required"`
	Amount        float64    `json:"amount" binding:"required"`
	TransactionID *uuid.UUID `json:"transaction_id,omitempty"`
	Notes         string     `json:"notes,omitempty"`
}

func (req *CreateSplitSettlementRequest) ToModel() *model.SplitSettlement {
	return &model.SplitSettlement{
		ID:            uuid.New(),
		ParticipantID: req.ParticipantID,
		Amount:        req.Amount,
		TransactionID: req.TransactionID,
		SettlementDate: time.Now(),
		Notes:         req.Notes,
	}
}
