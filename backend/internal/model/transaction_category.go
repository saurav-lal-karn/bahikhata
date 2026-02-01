package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// TransactionCategoryType defines the type of a transaction category (INCOME or EXPENSE).
type TransactionCategoryType string

const (
	CategoryTypeIncome  TransactionCategoryType = "INCOME"
	CategoryTypeExpense TransactionCategoryType = "EXPENSE"
)

// TransactionCategory represents a category for a unified transaction.
// Categories can be organized in a hierarchy and scoped to a family or system-wide.
type TransactionCategory struct {
	ID          uuid.UUID               `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name        string                  `json:"name" gorm:"type:text;not null"`
	Type        TransactionCategoryType `json:"type" gorm:"type:public.enum_transaction_category_type;not null"`
	Description string                  `json:"description,omitempty" gorm:"type:text"`
	Icon        string                  `json:"icon,omitempty" gorm:"type:text"`
	Color       string                  `json:"color,omitempty" gorm:"type:text"`
	IsActive    bool                    `json:"is_active" gorm:"type:boolean;default:true"`
	IsSystem    bool                    `json:"is_system" gorm:"type:boolean;default:false"`
	ParentID    *uuid.UUID              `json:"parent_id,omitempty" gorm:"type:uuid"`
	FamilyID    *uuid.UUID              `json:"family_id,omitempty" gorm:"type:uuid"`
	CreatedAt   time.Time               `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt   time.Time               `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`
	DeletedAt   gorm.DeletedAt          `json:"-" gorm:"index"`

	// Relationships
	Parent   *TransactionCategory `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Children []TransactionCategory `json:"children,omitempty" gorm:"foreignKey:ParentID"`
	Family   *Family              `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

// TableName returns the table name for the TransactionCategory model.
func (TransactionCategory) TableName() string {
	return "transaction_categories"
}
