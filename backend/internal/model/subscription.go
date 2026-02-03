package model

import (
	"time"

	"github.com/google/uuid"
)

type SubscriptionStatus string

const (
	SubscriptionActive    SubscriptionStatus = "ACTIVE"
	SubscriptionPaused    SubscriptionStatus = "PAUSED"
	SubscriptionCancelled SubscriptionStatus = "CANCELLED"
)

type Subscription struct {
	ID                     uuid.UUID          `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID               uuid.UUID          `json:"family_id" gorm:"type:uuid;not null;index"`
	Name                   string             `json:"name" gorm:"type:text;not null"`
	Amount                 float64            `json:"amount" gorm:"type:numeric;not null"`
	Frequency              RecurringFrequency `json:"frequency" gorm:"type:public.enum_recurring_frequency;default:'MONTHLY'"`
	CategoryID             *uuid.UUID         `json:"category_id,omitempty" gorm:"type:uuid;index"`
	WalletID               *uuid.UUID         `json:"wallet_id,omitempty" gorm:"type:uuid;index"`
	VendorID               *uuid.UUID         `json:"vendor_id,omitempty" gorm:"type:uuid;index"`
	NextBillingDate        *time.Time         `json:"next_billing_date,omitempty" gorm:"type:date"`
	StartDate              time.Time          `json:"start_date" gorm:"type:date;not null"`
	Status                 SubscriptionStatus `json:"status" gorm:"type:text;not null;default:'ACTIVE'"`
	RecurringTransactionID *uuid.UUID         `json:"recurring_transaction_id,omitempty" gorm:"type:uuid;index"`
	CreatedAt              time.Time          `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt              time.Time          `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	Family               Family                `json:"-" gorm:"foreignKey:FamilyID"`
	Category             *TransactionCategory  `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Wallet               *Wallet               `json:"wallet,omitempty" gorm:"foreignKey:WalletID"`
	Vendor               *Contact              `json:"vendor,omitempty" gorm:"foreignKey:VendorID"`
	RecurringTransaction *RecurringTransaction `json:"recurring_transaction,omitempty" gorm:"foreignKey:RecurringTransactionID"`
	Payments             []SubscriptionPayment `json:"payments,omitempty" gorm:"foreignKey:SubscriptionID"`
}

func (Subscription) TableName() string {
	return "subscriptions"
}

type SubscriptionPayment struct {
	ID                 uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	SubscriptionID     uuid.UUID  `json:"subscription_id" gorm:"type:uuid;not null;index"`
	TransactionID      uuid.UUID  `json:"transaction_id" gorm:"type:uuid;not null;index"`
	BillingPeriodStart *time.Time `json:"billing_period_start,omitempty" gorm:"type:date"`
	BillingPeriodEnd   *time.Time `json:"billing_period_end,omitempty" gorm:"type:date"`
	CreatedAt          time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	Subscription *Subscription `json:"-" gorm:"foreignKey:SubscriptionID"`
	Transaction  *Transaction   `json:"transaction,omitempty" gorm:"foreignKey:TransactionID"`
}

func (SubscriptionPayment) TableName() string {
	return "subscription_payments"
}
