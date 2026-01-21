package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Debt struct {
	ID              uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	FamilyID        *uuid.UUID     `json:"family_id"`
	UserID          *uuid.UUID     `json:"user_id"`
	Lender          string         `json:"lender"`
	TotalAmount     float64        `json:"total_amount"`
	RemainingAmount float64        `json:"remaining_amount"`
	InterestRate    float64        `json:"interest_rate"`
	DueDate         time.Time      `json:"due_date"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"deleted_at"`

	Family *Family `json:"family" gorm:"foreignKey:FamilyID"`
	User   *User   `json:"user" gorm:"foreignKey:UserID"`
}

func (Debt) TableName() string {
	return "debts"
}
