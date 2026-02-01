package model

import (
	"time"

	"github.com/google/uuid"
)

type SplitMethod string

const (
	SplitEqual      SplitMethod = "EQUAL"
	SplitPercentage SplitMethod = "PERCENTAGE"
	SplitExact      SplitMethod = "EXACT"
)

const (
	SplitStatusUnpaid  = "UNPAID"
	SplitStatusPartial = "PARTIAL"
	SplitStatusSettled = "SETTLED"
)

type ExpenseSplit struct {
	ID            uuid.UUID   `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	TransactionID uuid.UUID   `json:"transaction_id" gorm:"type:uuid;not null;index"`
	TotalAmount   float64     `json:"total_amount" gorm:"type:numeric;not null"`
	SplitMethod   SplitMethod `json:"split_method" gorm:"type:public.enum_split_method;default:'EQUAL'"`
	CreatedAt     time.Time   `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt     time.Time   `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	Transaction  *Transaction       `json:"-" gorm:"foreignKey:TransactionID"`
	Participants []SplitParticipant `json:"participants,omitempty" gorm:"foreignKey:SplitID"`
}

func (ExpenseSplit) TableName() string {
	return "expense_splits"
}

type SplitParticipant struct {
	ID          uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	SplitID     uuid.UUID  `json:"split_id" gorm:"type:uuid;not null;index"`
	UserID      *uuid.UUID `json:"user_id,omitempty" gorm:"type:uuid;index"`
	ContactID   *uuid.UUID `json:"contact_id,omitempty" gorm:"type:uuid;index"`
	AmountOwed  float64    `json:"amount_owed" gorm:"type:numeric;not null"`
	AmountPaid  float64    `json:"amount_paid" gorm:"type:numeric;not null;default:0"`
	Status      string     `json:"status" gorm:"type:text;not null;default:'UNPAID'"`
	CreatedAt   time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt   time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	Split       *ExpenseSplit      `json:"-" gorm:"foreignKey:SplitID"`
	User        *User              `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Contact     *Contact           `json:"contact,omitempty" gorm:"foreignKey:ContactID"`
	Settlements []SplitSettlement `json:"settlements,omitempty" gorm:"foreignKey:ParticipantID"`
}

func (SplitParticipant) TableName() string {
	return "split_participants"
}

type SplitSettlement struct {
	ID             uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	ParticipantID  uuid.UUID  `json:"participant_id" gorm:"type:uuid;not null;index"`
	TransactionID  *uuid.UUID `json:"transaction_id,omitempty" gorm:"type:uuid;index"`
	Amount         float64    `json:"amount" gorm:"type:numeric;not null"`
	SettlementDate time.Time  `json:"settlement_date" gorm:"type:timestamp;not null;default:now()"`
	Notes          string     `json:"notes,omitempty" gorm:"type:text"`
	CreatedAt      time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	Participant *SplitParticipant `json:"-" gorm:"foreignKey:ParticipantID"`
	Transaction *Transaction      `json:"transaction,omitempty" gorm:"foreignKey:TransactionID"`
}

func (SplitSettlement) TableName() string {
	return "split_settlements"
}
