package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WalletType struct {
	ID uuid.UUID `json:"id"`
	Name string `json:"name"`
	Description string `json:"description"`
	IsSystem bool `json:"is_system"`
	FamilyID uuid.UUID `json:"family_id"`
	CreatedByID uuid.UUID `json:"created_by_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}

func (WalletType) TableName() string {
	return "wallet_types"
}