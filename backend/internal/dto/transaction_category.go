package dto

import (
	"github.com/sauravkarn541/bahikhata/internal/model"
)

// ==================== Request DTOs ====================

// CreateTransactionCategoryRequest represents the payload for creating a new transaction category.
type CreateTransactionCategoryRequest struct {
	Name        string                       `json:"name" binding:"required,max=100"`
	Type        model.TransactionCategoryType `json:"type" binding:"required,oneof=INCOME EXPENSE"`
	Description string                       `json:"description" binding:"max=255"`
	Icon        string                       `json:"icon" binding:"max=50"`
	Color       string                       `json:"color" binding:"max=50"`
	ParentID    *string                      `json:"parent_id" binding:"omitempty,uuid"`
	FamilyID    string                       `json:"family_id" binding:"required,uuid"`
}

// UpdateTransactionCategoryRequest represents the payload for updating an existing transaction category.
type UpdateTransactionCategoryRequest struct {
	Name        string  `json:"name" binding:"required,max=100"`
	Description string  `json:"description" binding:"max=255"`
	Icon        string  `json:"icon" binding:"max=50"`
	Color       string  `json:"color" binding:"max=50"`
	IsActive    bool    `json:"is_active"`
	ParentID    *string `json:"parent_id" binding:"omitempty,uuid"`
}

// ==================== Response DTOs ====================

// TransactionCategoryResponse represents the API response for a transaction category.
type TransactionCategoryResponse struct {
	ID          string                       `json:"id"`
	Name        string                       `json:"name"`
	Type        model.TransactionCategoryType `json:"type"`
	Description string                       `json:"description,omitempty"`
	Icon        string                       `json:"icon,omitempty"`
	Color       string                       `json:"color,omitempty"`
	IsActive    bool                         `json:"is_active"`
	IsSystem    bool                         `json:"is_system"`
	ParentID    *string                      `json:"parent_id,omitempty"`
	FamilyID    *string                      `json:"family_id,omitempty"`
	CreatedAt   string                       `json:"created_at"`
	UpdatedAt   string                       `json:"updated_at"`
	Parent      *TransactionCategoryResponse `json:"parent,omitempty"`
}

// ==================== Mappers ====================

// ToTransactionCategoryResponse converts a model.TransactionCategory to TransactionCategoryResponse.
func ToTransactionCategoryResponse(m *model.TransactionCategory) *TransactionCategoryResponse {
	if m == nil {
		return nil
	}

	resp := &TransactionCategoryResponse{
		ID:          m.ID.String(),
		Name:        m.Name,
		Type:        m.Type,
		Description: m.Description,
		Icon:        m.Icon,
		Color:       m.Color,
		IsActive:    m.IsActive,
		IsSystem:    m.IsSystem,
		CreatedAt:   m.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:   m.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	if m.ParentID != nil {
		parentID := m.ParentID.String()
		resp.ParentID = &parentID
	}

	if m.FamilyID != nil {
		familyID := m.FamilyID.String()
		resp.FamilyID = &familyID
	}

	if m.Parent != nil {
		resp.Parent = ToTransactionCategoryResponse(m.Parent)
	}

	return resp
}
