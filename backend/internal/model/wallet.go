package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Wallet struct {
	ID uuid.UUID `json:"id"`
	Name string `json:"name"`
	StartingBalance float64 `json:"starting_balance"`
	Balance float64 `json:"balance"`
	Currency string `json:"currency"`
	Description string `json:"description"`
	WalletIssuerName string `json:"wallet_issuer_name"`
	WalletID string `json:"wallet_id"`
	WalletTypeID uuid.UUID `json:"wallet_type_id"`
	UserID uuid.UUID `json:"user_id"`
	FamilyID uuid.UUID `json:"family_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`

	User *User `json:"user" gorm:"foreignKey:UserID"`
	Family *Family `json:"family" gorm:"foreignKey:FamilyID"`
	WalletType *WalletType `json:"wallet_type" gorm:"foreignKey:WalletTypeID"`
}

func (Wallet) TableName() string {
	return "wallets"
}