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

type TaxSummary struct {
	ID              uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID        uuid.UUID `json:"family_id" gorm:"type:uuid;not null;uniqueIndex:idx_tax_summary_family_year"`
	FiscalYear      int       `json:"fiscal_year" gorm:"type:int;not null;uniqueIndex:idx_tax_summary_family_year"`
	TotalIncome     float64   `json:"total_income" gorm:"type:numeric;not null;default:0"`
	TaxableIncome   float64   `json:"taxable_income" gorm:"type:numeric;not null;default:0"`
	TotalDeductions float64   `json:"total_deductions" gorm:"type:numeric;not null;default:0"`
	TaxLiability    float64   `json:"tax_liability" gorm:"type:numeric;not null;default:0"`
	TaxPaid         float64   `json:"tax_paid" gorm:"type:numeric;not null;default:0"`
	Breakdown       JSONB     `json:"breakdown,omitempty" gorm:"type:jsonb"`
	CreatedAt       time.Time `json:"created_at" gorm:"type:timestamp;default:now()"`
	UpdatedAt       time.Time `json:"updated_at" gorm:"type:timestamp;default:now()"`

	Family *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

func (TaxSummary) TableName() string {
	return "tax_summaries"
}
