package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Income struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	Name        string         `json:"name" gorm:"type:text"`
	Amount      float64        `json:"amount" gorm:"type:decimal(20,2)"`
	Description string         `json:"description" gorm:"type:text"`
	SourceID    *uuid.UUID     `json:"source_id" gorm:"type:uuid"`
	WalletID    *uuid.UUID     `json:"wallet_id" gorm:"type:uuid"`
	FamilyID    *uuid.UUID     `json:"family_id" gorm:"type:uuid"`
	CreatedByID *uuid.UUID     `json:"created_by_id" gorm:"type:uuid"`
	Date        time.Time      `json:"date" gorm:"type:timestamp"`
	CreatedAt   time.Time      `json:"created_at" gorm:"type:timestamp"`
	UpdatedAt   time.Time      `json:"updated_at" gorm:"type:timestamp"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	// Optional: Associations
	Family *Family `json:"family" gorm:"foreignKey:FamilyID"`
	Wallet *Wallet `json:"wallet" gorm:"foreignKey:WalletID"`
	Creator *User  `json:"creator" gorm:"foreignKey:CreatedByID"`
	Source *IncomeType `json:"source" gorm:"foreignKey:SourceID"`
}

func (Income) TableName() string {
	return "income"
}