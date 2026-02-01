package dto

import (
	"github.com/sauravkarn541/bahikhata/internal/model"
)

// PaymentMethodResponse represents the API response for a payment method.
type PaymentMethodResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	IconName    string `json:"icon_name,omitempty"`
	IsSystem    bool   `json:"is_system"`
}

// ToPaymentMethodResponse converts a model.PaymentMethod to PaymentMethodResponse.
func ToPaymentMethodResponse(m *model.PaymentMethod) *PaymentMethodResponse {
	if m == nil {
		return nil
	}
	return &PaymentMethodResponse{
		ID:          m.ID.String(),
		Name:        m.Name,
		Description: m.Description,
		IconName:    m.IconName,
		IsSystem:    m.IsSystem,
	}
}
