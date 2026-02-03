package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateInsurancePolicyRequest struct {
	FamilyID         uuid.UUID                 `json:"family_id"`
	ContactID        *uuid.UUID                `json:"contact_id"`
	PolicyName       string                    `json:"policy_name" binding:"required"`
	PolicyNumber     string                    `json:"policy_number"`
	Type             string                    `json:"type" binding:"required"` // LIFE, HEALTH, etc.
	PremiumAmount    float64                   `json:"premium_amount" binding:"required"`
	PremiumFrequency string                    `json:"premium_frequency" binding:"required"`
	SumAssured       float64                   `json:"sum_assured"`
	StartDate        string                    `json:"start_date" binding:"required"`
	EndDate          *string                   `json:"end_date"`
}

type InsurancePolicyResponse struct {
	ID               uuid.UUID             `json:"id"`
	PolicyName       string                `json:"policy_name"`
	PolicyNumber     string                `json:"policy_number"`
	Type             model.InsurancePolicyType `json:"type"`
	Status           model.InsurancePolicyStatus `json:"status"`
	PremiumAmount    float64               `json:"premium_amount"`
	PremiumFrequency model.RecurringFrequency `json:"premium_frequency"`
	SumAssured       float64               `json:"sum_assured"`
	StartDate        time.Time             `json:"start_date"`
	EndDate          *time.Time            `json:"end_date"`
	NextDueDate      *time.Time            `json:"next_due_date"`
	Provider         *ContactResponse       `json:"provider,omitempty"`
}

func ToInsurancePolicyResponse(p model.InsurancePolicy) InsurancePolicyResponse {
	res := InsurancePolicyResponse{
		ID:               p.ID,
		PolicyName:       p.PolicyName,
		PolicyNumber:     p.PolicyNumber,
		Type:             p.Type,
		Status:           p.Status,
		PremiumAmount:    p.PremiumAmount,
		PremiumFrequency: p.PremiumFrequency,
		SumAssured:       p.SumAssured,
		StartDate:        p.StartDate,
		EndDate:          p.EndDate,
		NextDueDate:      p.NextDueDate,
	}
	if p.Provider != nil {
		res.Provider = ToContactResponse(p.Provider)
	}
	return res
}

// Premium DTOs
type CreatePremiumRequest struct {
	PolicyID    uuid.UUID `json:"policy_id" binding:"required"`
	Amount      float64   `json:"amount" binding:"required"`
	DueDate     string    `json:"due_date" binding:"required"`
	PaymentDate *string   `json:"payment_date"`
}

type PremiumResponse struct {
	ID          uuid.UUID  `json:"id"`
	PolicyID    uuid.UUID  `json:"policy_id"`
	Amount      float64    `json:"amount"`
	DueDate     time.Time  `json:"due_date"`
	PaymentDate *time.Time `json:"payment_date"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
}

func ToPremiumResponse(p model.Premium) PremiumResponse {
	return PremiumResponse{
		ID:          p.ID,
		PolicyID:    p.PolicyID,
		Amount:      p.Amount,
		DueDate:     p.DueDate,
		PaymentDate: p.PaymentDate,
		Status:      p.Status,
		CreatedAt:   p.CreatedAt,
	}
}

// Claim DTOs
type CreateClaimRequest struct {
	PolicyID      uuid.UUID `json:"policy_id" binding:"required"`
	AmountClaimed float64   `json:"amount_claimed" binding:"required"`
	ClaimDate     string    `json:"claim_date" binding:"required"`
	Description   string    `json:"description"`
}

type ClaimResponse struct {
	ID             uuid.UUID  `json:"id"`
	PolicyID       uuid.UUID  `json:"policy_id"`
	ClaimNumber    string     `json:"claim_number"`
	AmountClaimed  float64    `json:"amount_claimed"`
	AmountReceived *float64   `json:"amount_received"`
	ClaimDate      time.Time  `json:"claim_date"`
	Status         string     `json:"status"`
	Description    string     `json:"description"`
	CreatedAt      time.Time  `json:"created_at"`
}

func ToClaimResponse(c model.Claim) ClaimResponse {
	return ClaimResponse{
		ID:             c.ID,
		PolicyID:       c.PolicyID,
		ClaimNumber:    c.ClaimNumber,
		AmountClaimed:  c.AmountClaimed,
		AmountReceived: c.AmountReceived,
		ClaimDate:      c.ClaimDate,
		Status:         c.Status,
		Description:    c.Description,
		CreatedAt:      c.CreatedAt,
	}
}
