package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Expense struct {
	ID              uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	Amount          float64        `json:"amount" gorm:"type:decimal(20,2)"`
	Description     string         `json:"description" gorm:"type:text"`
	PaymentMethodID uuid.UUID      `json:"payment_method_id" gorm:"type:uuid"`
	CategoryID      uuid.UUID      `json:"category_id" gorm:"type:uuid"`
	FamilyID        uuid.UUID      `json:"family_id" gorm:"type:uuid"`
	CreatedByID     uuid.UUID      `json:"created_by_id" gorm:"type:uuid"`
	TransactionDate time.Time      `json:"transaction_date" gorm:"type:timestamp"`
	CreatedAt       time.Time      `json:"created_at" gorm:"type:timestamp"`
	UpdatedAt       time.Time      `json:"updated_at" gorm:"type:timestamp"`
	DeletedAt       gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	// Optional: Associations
	Category ExpenseCategory `json:"category" gorm:"foreignKey:CategoryID"`
	Family   Family          `json:"family" gorm:"foreignKey:FamilyID"`
	Creator  User            `json:"creator" gorm:"foreignKey:CreatedByID"`
	PaymentMethod PaymentMethod `json:"payment_method" gorm:"foreignKey:PaymentMethodID"`
}

func (Expense) TableName() string {
	return "expenses"
}
