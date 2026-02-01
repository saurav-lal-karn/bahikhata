package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Debt struct {
	ID              uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	FamilyID        uuid.UUID      `json:"family_id"`
	UserID          uuid.UUID      `json:"user_id"`
	Lender          string         `json:"lender"`
	TotalAmount     float64        `json:"total_amount"`
	RemainingAmount float64        `json:"remaining_amount"`
	InterestRate    float64        `json:"interest_rate"`
	DueDate         time.Time      `json:"due_date"`
	LenderContactID *uuid.UUID     `json:"lender_contact_id,omitempty" gorm:"type:uuid;index"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"deleted_at"`

	Family        *Family         `json:"family" gorm:"foreignKey:FamilyID"`
	User          *User           `json:"user" gorm:"foreignKey:UserID"`
	LenderContact *Contact        `json:"lender_contact,omitempty" gorm:"foreignKey:LenderContactID"`
	Repayments    []DebtRepayment `json:"repayments" gorm:"foreignKey:DebtID"`
	Schedules     []DebtSchedule  `json:"schedules,omitempty" gorm:"foreignKey:DebtID"`
}

type DebtSchedule struct {
	ID                uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	DebtID            uuid.UUID `json:"debt_id" gorm:"type:uuid;not null;index"`
	InstallmentNumber int       `json:"installment_number" gorm:"type:integer;not null"`
	DueDate           time.Time `json:"due_date" gorm:"type:date;not null"`
	PrincipalAmount   float64   `json:"principal_amount" gorm:"type:numeric;not null"`
	InterestAmount    float64   `json:"interest_amount" gorm:"type:numeric;not null"`
	TotalInstallment  float64   `json:"total_installment" gorm:"type:numeric;not null"`
	RemainingBalance  float64   `json:"remaining_balance" gorm:"type:numeric;not null"`
	Status            string    `json:"status" gorm:"type:text;default:'PENDING'"`
	CreatedAt         time.Time `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	Debt *Debt `json:"-" gorm:"foreignKey:DebtID"`
}

func (DebtSchedule) TableName() string {
	return "debt_schedules"
}

type DebtRepayment struct {
	ID            uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	DebtID        uuid.UUID  `json:"debt_id" gorm:"type:uuid;not null;index"`
	TransactionID *uuid.UUID `json:"transaction_id,omitempty" gorm:"type:uuid;index"`
	Amount        float64    `json:"amount" gorm:"type:numeric;not null"`
	RepaymentDate time.Time  `json:"repayment_date" gorm:"type:timestamp;not null;default:now()"`
	CreatedAt     time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt     time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Transaction *Transaction `json:"transaction,omitempty" gorm:"foreignKey:TransactionID"`
}

func (Debt) TableName() string {
	return "debts"
}

func (DebtRepayment) TableName() string {
	return "debt_repayments"
}
