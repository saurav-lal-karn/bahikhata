package dto

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateContactRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
	Type     string `json:"type" binding:"required"`
	FamilyID string `json:"family_id" binding:"required"`
}

type UpdateContactRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
	Type     string `json:"type"`
	IsActive *bool  `json:"is_active"`
}

type ContactResponse struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	Email    string    `json:"email"`
	Phone    string    `json:"phone"`
	Address  string    `json:"address"`
	Type     string    `json:"type"`
	IsActive bool      `json:"is_active"`
}

func ToContactResponse(m *model.Contact) *ContactResponse {
	if m == nil {
		return nil
	}
	return &ContactResponse{
		ID:       m.ID,
		Name:     m.Name,
		Email:    m.Email,
		Phone:    m.Phone,
		Address:  m.Address,
		Type:     string(m.Type),
		IsActive: m.IsActive,
	}
}
