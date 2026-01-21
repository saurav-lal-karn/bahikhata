package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TaxDocument struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	FamilyID  *uuid.UUID     `json:"family_id"`
	UserID    *uuid.UUID     `json:"user_id"`
	Name      string         `json:"name"`
	Category  string         `json:"category"`
	Year      string         `json:"year"`
	FileURL   string         `json:"file_url"`
	Remarks   string         `json:"remarks"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`

	Family *Family `json:"family" gorm:"foreignKey:FamilyID"`
	User   *User   `json:"user" gorm:"foreignKey:UserID"`
}

type TaxDeduction struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	FamilyID  *uuid.UUID     `json:"family_id"`
	UserID    *uuid.UUID     `json:"user_id"`
	Name      string         `json:"name"`
	Amount    float64        `json:"amount"`
	MaxLimit  float64        `json:"max_limit"`
	Category  string         `json:"category"` // 80C, 80D
	Year      string         `json:"year"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`

	Family *Family `json:"family" gorm:"foreignKey:FamilyID"`
	User   *User   `json:"user" gorm:"foreignKey:UserID"`
}

func (TaxDocument) TableName() string {
	return "tax_documents"
}

func (TaxDeduction) TableName() string {
	return "tax_deductions"
}
