package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PaymentMethod struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	Name string `json:"name" gorm:"type:text"`
	Description string `json:"description" gorm:"type:text"`
	IconName string `json:"icon_name" gorm:"type:text"`
	FamilyID *uuid.UUID `json:"family_id" gorm:"type:uuid"` // Nullable for system payment methods
	CreatedByID *uuid.UUID `json:"created_by_id" gorm:"type:uuid"` // Who created this (for custom methods)
	IsSystem bool `json:"is_system" gorm:"type:boolean"`
	CreatedAt time.Time `json:"created_at" gorm:"type:timestamp"`
	UpdatedAt time.Time `json:"updated_at" gorm:"type:timestamp"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`

	Family *Family `json:"family" gorm:"foreignKey:FamilyID"`
	Creator *User `json:"creator" gorm:"foreignKey:CreatedByID"`
}

func (PaymentMethod) TableName() string {
	return "payment_methods"
}