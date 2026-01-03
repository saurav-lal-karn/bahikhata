package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Family struct {
	ID        uuid.UUID      `json:"id"`
	Name      string         `json:"name"`
	CreatedBy uuid.UUID      `json:"created_by"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}

// TableName specifies the table name for ExpenseCategory
func (Family) TableName() string {
	return "family"
}
