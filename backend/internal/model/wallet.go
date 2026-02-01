package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Wallet represents a financial wallet/account in the system.
// It belongs to a user within a family and has an associated wallet type.
// Wallets track both the starting balance (historical) and current balance.
type Wallet struct {
	// ID is the unique identifier for the wallet (UUID v4)
	ID uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`

	// Name is the user-friendly name for the wallet
	Name string `json:"name" gorm:"type:varchar(100);not null"`

	// StartingBalance is the initial balance when the wallet was created (immutable after creation)
	StartingBalance float64 `json:"starting_balance" gorm:"type:decimal(15,2);not null;default:0"`

	// Balance is the current balance of the wallet
	Balance float64 `json:"balance" gorm:"type:decimal(15,2);not null;default:0"`

	// Currency is the ISO 4217 currency code (e.g., USD, INR, EUR)
	Currency string `json:"currency" gorm:"type:varchar(3);not null"`

	// Description is an optional description of the wallet
	Description string `json:"description,omitempty" gorm:"type:varchar(500)"`

	// WalletIssuerName is the name of the bank or financial institution
	WalletIssuerName string `json:"wallet_issuer_name" gorm:"type:varchar(100)"`

	// ProviderWalletID is the external account/card number identifier
	ProviderWalletID string `json:"provider_wallet_id" gorm:"type:varchar(100)"`

	// WalletTypeID is the foreign key to the wallet type
	WalletTypeID uuid.UUID `json:"wallet_type_id" gorm:"type:uuid;not null;index"`

	// UserID is the foreign key to the user who owns this wallet
	UserID uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`

	// FamilyID is the foreign key to the family this wallet belongs to
	FamilyID uuid.UUID `json:"family_id" gorm:"type:uuid;not null;index"`

	// CreatedAt is the timestamp when the wallet was created
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`

	// UpdatedAt is the timestamp when the wallet was last updated
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`

	// DeletedAt is the soft delete timestamp (nil if not deleted)
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships (use pointers to allow nil values, exclude from direct JSON serialization)
	User       *User       `json:"-" gorm:"foreignKey:UserID"`
	Family     *Family     `json:"-" gorm:"foreignKey:FamilyID"`
	WalletType *WalletType `json:"wallet_type,omitempty" gorm:"foreignKey:WalletTypeID"`
}

// TableName returns the database table name for the Wallet model.
func (Wallet) TableName() string {
	return "wallets"
}
