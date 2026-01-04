package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type ExpenseCategory struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	Name        string         `json:"name" gorm:"type:text"`
	Description string         `json:"description" gorm:"type:text"`
	Tags        pq.StringArray `json:"tags" gorm:"type:text[]"`
	CreatedAt   time.Time      `json:"created_at" gorm:"type:timestamp"`
	UpdatedAt   time.Time      `json:"updated_at" gorm:"type:timestamp"`
	DeletedAt   gorm.DeletedAt `json:"deletedAt" gorm:"index" yaml:"-"`
}

// TableName specifies the table name for ExpenseCategory
func (ExpenseCategory) TableName() string {
	return "expense_categories"
}
