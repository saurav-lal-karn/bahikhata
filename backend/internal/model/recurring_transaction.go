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

	Family    *Family             `json:"family" gorm:"foreignKey:FamilyID"`
	User      *User               `json:"user" gorm:"foreignKey:UserID"`
	Instances []RecurringInstance `json:"instances" gorm:"foreignKey:RecurringID"`
}

type RecurringInstance struct {
	ID            uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	RecurringID   uuid.UUID  `json:"recurring_id" gorm:"type:uuid;not null;index"`
	TransactionID *uuid.UUID `json:"transaction_id,omitempty" gorm:"type:uuid;index"`
	ExecutionDate time.Time  `json:"execution_date" gorm:"type:timestamp;not null;default:now()"`
	Status        string     `json:"status" gorm:"type:text;not null"` // SUCCESS, FAILED
	ErrorMessage  *string    `json:"error_message,omitempty" gorm:"type:text"`
	CreatedAt     time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt     time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Transaction *Transaction `json:"transaction,omitempty" gorm:"foreignKey:TransactionID"`
}

func (RecurringTransaction) TableName() string {
	return "recurring_transactions"
}

func (RecurringInstance) TableName() string {
	return "recurring_instances"
}
