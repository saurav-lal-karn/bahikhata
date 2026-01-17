package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WalletTransfer struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FromWalletID uuid.UUID      `json:"from_wallet_id"`
	ToWalletID   uuid.UUID      `json:"to_wallet_id"`
	Amount       float64        `json:"amount"`
	Date         time.Time      `json:"date"`
	Remarks      string         `json:"remarks"`
	UserID       uuid.UUID      `json:"user_id"`
	FamilyId     uuid.UUID      `json:"family_id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	FromWallet *Wallet `json:"from_wallet"`
	ToWallet   *Wallet `json:"to_wallet"`
	Family     *Family `json:"family"`
	User       *User   `json:"user"`
}
