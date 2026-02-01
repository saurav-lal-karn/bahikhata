package model

import (
	"time"

	"github.com/google/uuid"
)

type InsurancePolicyType string

const (
	InsuranceLife     InsurancePolicyType = "LIFE"
	InsuranceHealth   InsurancePolicyType = "HEALTH"
	InsuranceMotor    InsurancePolicyType = "MOTOR"
	InsuranceTravel   InsurancePolicyType = "TRAVEL"
	InsuranceProperty InsurancePolicyType = "PROPERTY"
	InsuranceOther    InsurancePolicyType = "OTHER"
)

type InsurancePolicyStatus string

const (
	InsuranceActive    InsurancePolicyStatus = "ACTIVE"
	InsuranceExpired   InsurancePolicyStatus = "EXPIRED"
	InsuranceLapsed    InsurancePolicyStatus = "LAPSED"
	InsuranceCancelled InsurancePolicyStatus = "CANCELLED"
)

type InsurancePolicy struct {
	ID               uuid.UUID             `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID         uuid.UUID             `json:"family_id" gorm:"type:uuid;not null;index"`
	ContactID        *uuid.UUID            `json:"contact_id,omitempty" gorm:"type:uuid;index"`
	PolicyName       string                `json:"policy_name" gorm:"type:text;not null"`
	PolicyNumber     string                `json:"policy_number,omitempty" gorm:"type:text"`
	Type             InsurancePolicyType   `json:"type" gorm:"type:public.enum_insurance_policy_type;default:'OTHER'"`
	Status           InsurancePolicyStatus `json:"status" gorm:"type:public.enum_insurance_policy_status;default:'ACTIVE'"`
	PremiumAmount    float64               `json:"premium_amount" gorm:"type:numeric;not null;default:0"`
	PremiumFrequency RecurringFrequency    `json:"premium_frequency" gorm:"type:public.enum_recurring_frequency;default:'MONTHLY'"`
	SumAssured       float64               `json:"sum_assured" gorm:"type:numeric;not null;default:0"`
	StartDate        time.Time             `json:"start_date" gorm:"type:date;not null"`
	EndDate          *time.Time            `json:"end_date,omitempty" gorm:"type:date"`
	NextDueDate      *time.Time            `json:"next_due_date,omitempty" gorm:"type:date"`
	PolicyDocumentID *uuid.UUID            `json:"policy_document_id,omitempty" gorm:"type:uuid"`
	CreatedAt        time.Time             `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt        time.Time             `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	Family   Family     `json:"-" gorm:"foreignKey:FamilyID"`
	Provider *Contact   `json:"provider,omitempty" gorm:"foreignKey:ContactID"`
	Premiums []Premium  `json:"premiums,omitempty" gorm:"foreignKey:PolicyID"`
	Claims   []Claim    `json:"claims,omitempty" gorm:"foreignKey:PolicyID"`
}

func (InsurancePolicy) TableName() string {
	return "insurance_policies"
}

type Premium struct {
	ID            uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	PolicyID      uuid.UUID  `json:"policy_id" gorm:"type:uuid;not null;index"`
	TransactionID *uuid.UUID `json:"transaction_id,omitempty" gorm:"type:uuid;index"`
	Amount        float64    `json:"amount" gorm:"type:numeric;not null"`
	DueDate       time.Time  `json:"due_date" gorm:"type:date;not null"`
	PaymentDate   *time.Time `json:"payment_date,omitempty" gorm:"type:date"`
	Status        string     `json:"status" gorm:"type:text;default:'PENDING'"`
	CreatedAt     time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	Policy      *InsurancePolicy `json:"-" gorm:"foreignKey:PolicyID"`
	Transaction *Transaction     `json:"transaction,omitempty" gorm:"foreignKey:TransactionID"`
}

func (Premium) TableName() string {
	return "insurance_premiums"
}

type Claim struct {
	ID             uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	PolicyID       uuid.UUID  `json:"policy_id" gorm:"type:uuid;not null;index"`
	ClaimNumber    string     `json:"claim_number,omitempty" gorm:"type:text"`
	AmountClaimed  float64    `json:"amount_claimed" gorm:"type:numeric;not null"`
	AmountReceived *float64   `json:"amount_received,omitempty" gorm:"type:numeric"`
	ClaimDate      time.Time  `json:"claim_date" gorm:"type:date;not null"`
	Status         string     `json:"status" gorm:"type:text;not null;default:'SUBMITTED'"`
	Description    string     `json:"description,omitempty" gorm:"type:text"`
	CreatedAt      time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt      time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	Policy *InsurancePolicy `json:"-" gorm:"foreignKey:PolicyID"`
}

func (Claim) TableName() string {
	return "insurance_claims"
}
