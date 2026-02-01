package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Investment struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	FamilyID     *uuid.UUID     `json:"family_id"`
	UserID       *uuid.UUID     `json:"user_id"`
	Name         string         `json:"name"`
	Type         string         `json:"type"`
	Quantity     float64        `json:"quantity"`
	AvgBuyPrice  float64        `json:"avg_buy_price"`
	CurrentPrice float64        `json:"current_price"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at"`

	Family       *Family                 `json:"family" gorm:"foreignKey:FamilyID"`
	User         *User                   `json:"user" gorm:"foreignKey:UserID"`
	Transactions []InvestmentTransaction `json:"transactions" gorm:"foreignKey:InvestmentID"`
}

type InvestmentTransactionType string

const (
	InvestmentTransactionTypeBuy      InvestmentTransactionType = "BUY"
	InvestmentTransactionTypeSell     InvestmentTransactionType = "SELL"
	InvestmentTransactionTypeDividend InvestmentTransactionType = "DIVIDEND"
)

type InvestmentTransaction struct {
	ID              uuid.UUID                 `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	InvestmentID    uuid.UUID                 `json:"investment_id" gorm:"type:uuid;not null;index"`
	TransactionID   *uuid.UUID                `json:"transaction_id,omitempty" gorm:"type:uuid;index"`
	Type            InvestmentTransactionType `json:"type" gorm:"type:public.enum_investment_transaction_type;not null"`
	Quantity        float64                   `json:"quantity" gorm:"type:numeric;not null"`
	PricePerUnit    float64                   `json:"price_per_unit" gorm:"type:numeric;not null"`
	TransactionDate time.Time                 `json:"transaction_date" gorm:"type:timestamp;not null;default:now()"`
	CreatedAt       time.Time                 `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt       time.Time                 `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Transaction *Transaction `json:"transaction,omitempty" gorm:"foreignKey:TransactionID"`
}

func (Investment) TableName() string {
	return "investments"
}

func (InvestmentTransaction) TableName() string {
	return "investment_transactions"
}
