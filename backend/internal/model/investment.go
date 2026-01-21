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

	Family *Family `json:"family" gorm:"foreignKey:FamilyID"`
	User   *User   `json:"user" gorm:"foreignKey:UserID"`
}

func (Investment) TableName() string {
	return "investments"
}
