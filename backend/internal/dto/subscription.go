package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateSubscriptionRequest struct {
	FamilyID        uuid.UUID `json:"family_id"`
	Name            string    `json:"name" binding:"required"`
	Amount          float64   `json:"amount" binding:"required"`
	Frequency       string    `json:"frequency" binding:"required"`
	CategoryID      *uuid.UUID `json:"category_id"`
	WalletID        *uuid.UUID `json:"wallet_id"`
	StartDate       string    `json:"start_date" binding:"required"`
	NextBillingDate *string   `json:"next_billing_date"`
}

type SubscriptionResponse struct {
	ID              uuid.UUID              `json:"id"`
	Name            string                 `json:"name"`
	Amount          float64                `json:"amount"`
	Frequency       model.RecurringFrequency `json:"frequency"`
	Status          model.SubscriptionStatus `json:"status"`
	NextBillingDate *time.Time             `json:"next_billing_date"`
	StartDate       time.Time              `json:"start_date"`
	Category        *TransactionCategoryResponse `json:"category,omitempty"`
	Wallet          *WalletResponse        `json:"wallet,omitempty"`
}

func ToSubscriptionResponse(s model.Subscription) SubscriptionResponse {
	res := SubscriptionResponse{
		ID:              s.ID,
		Name:            s.Name,
		Amount:          s.Amount,
		Frequency:       s.Frequency,
		Status:          s.Status,
		NextBillingDate: s.NextBillingDate,
		StartDate:       s.StartDate,
	}
	if s.Category != nil {
		res.Category = ToTransactionCategoryResponse(s.Category)
	}
	if s.Wallet != nil {
		w := ToWalletResponse(s.Wallet)
		res.Wallet = &w
	}
	return res
}
