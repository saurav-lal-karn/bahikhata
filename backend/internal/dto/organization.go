package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateTagRequest struct {
	Name     string `json:"name" binding:"required"`
	Color    string `json:"color"`
	FamilyID string `json:"family_id" binding:"required"`
}

type CreateProjectRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	FamilyID    string `json:"family_id" binding:"required"`
}

type CreateLocationRequest struct {
	Name      string  `json:"name" binding:"required"`
	Latitude  *float64 `json:"latitude"`
	Longitude *float64 `json:"longitude"`
	Address   string  `json:"address"`
}

type TagResponse struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Color string    `json:"color"`
}

type ProjectResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	StartDate   *string   `json:"start_date"`
	EndDate     *string   `json:"end_date"`
	IsActive    bool      `json:"is_active"`
}

type LocationResponse struct {
	ID      uuid.UUID `json:"id"`
	Name    string    `json:"name"`
	Address string    `json:"address"`
}

func ToTagResponse(m *model.Tag) *TagResponse {
	if m == nil {
		return nil
	}
	return &TagResponse{
		ID:    m.ID,
		Name:  m.Name,
		Color: m.Color,
	}
}

func ToProjectResponse(m *model.Project) *ProjectResponse {
	if m == nil {
		return nil
	}
	resp := &ProjectResponse{
		ID:          m.ID,
		Name:        m.Name,
		Description: m.Description,
		IsActive:    m.IsActive,
	}
	if m.StartDate != nil {
		start := m.StartDate.Format(time.RFC3339)
		resp.StartDate = &start
	}
	if m.EndDate != nil {
		end := m.EndDate.Format(time.RFC3339)
		resp.EndDate = &end
	}
	return resp
}

func ToLocationResponse(m *model.Location) *LocationResponse {
	if m == nil {
		return nil
	}
	return &LocationResponse{
		ID:      m.ID,
		Name:    m.Name,
		Address: m.Address,
	}
}
