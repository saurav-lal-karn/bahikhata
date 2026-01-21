package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RecurringTransaction struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	FamilyID    *uuid.UUID     `json:"family_id"`
	UserID      *uuid.UUID     `json:"user_id"`
	Name        string         `json:"name"`
	Amount      float64        `json:"amount"`
	Frequency   string         `json:"frequency"` // Monthly, Weekly, Yearly
	NextDueDate time.Time      `json:"next_due_date"`
	Type        string         `json:"type"` // Bill, Subscription
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at"`

	Family *Family `json:"family" gorm:"foreignKey:FamilyID"`
	User   *User   `json:"user" gorm:"foreignKey:UserID"`
}

func (RecurringTransaction) TableName() string {
	return "recurring_transactions"
}
