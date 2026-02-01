package model

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// JSONB is a custom type for handling PostgreSQL JSONB columns in GORM.
type JSONB json.RawMessage

// Scan implements the sql.Scanner interface for JSONB.
func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}
	s, ok := value.([]byte)
	if !ok {
		return errors.New("invalid type for JSONB")
	}
	*j = append((*j)[0:0], s...)
	return nil
}

// Value implements the driver.Valuer interface for JSONB.
func (j JSONB) Value() (driver.Value, error) {
	if len(j) == 0 {
		return nil, nil
	}
	return []byte(j), nil
}

// MarshalJSON implements the json.Marshaler interface for JSONB.
func (j JSONB) MarshalJSON() ([]byte, error) {
	if j == nil {
		return []byte("null"), nil
	}
	return j, nil
}

// UnmarshalJSON implements the json.Unmarshaler interface for JSONB.
func (j *JSONB) UnmarshalJSON(data []byte) error {
	if j == nil {
		return errors.New("JSONB: UnmarshalJSON on nil pointer")
	}
	*j = append((*j)[0:0], data...)
	return nil
}

// Transaction represents a unified financial ledger entry.
// It replaces separate income and expense records.
type Transaction struct {
	ID                uuid.UUID               `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Type              TransactionCategoryType `json:"type" gorm:"type:public.enum_transaction_category_type;not null"`
	Amount            float64                 `json:"amount" gorm:"type:numeric;not null"`
	Description       string                  `json:"description,omitempty" gorm:"type:text"`
	WalletID          uuid.UUID               `json:"wallet_id" gorm:"type:uuid;not null;index"`
	CategoryID        *uuid.UUID              `json:"category_id,omitempty" gorm:"type:uuid;index"`
	PaymentMethodID   *uuid.UUID              `json:"payment_method_id,omitempty" gorm:"type:uuid;index"`
	TransactionDate   time.Time               `json:"transaction_date" gorm:"type:timestamp;not null;default:now()"`
	FamilyID          uuid.UUID               `json:"family_id" gorm:"type:uuid;not null;index"`
	UserID            *uuid.UUID              `json:"user_id,omitempty" gorm:"type:uuid;index"`
	ParentID          *uuid.UUID              `json:"parent_id,omitempty" gorm:"type:uuid;index"`
	CreatedByID       uuid.UUID               `json:"created_by_id" gorm:"type:uuid;not null;index"`
	TransferRefID     *uuid.UUID              `json:"transfer_ref_id,omitempty" gorm:"type:uuid;index"`
	ContactID         *uuid.UUID              `json:"contact_id,omitempty" gorm:"type:uuid;index"`
	LocationID        *uuid.UUID              `json:"location_id,omitempty" gorm:"type:uuid;index"`
	ProjectID         *uuid.UUID              `json:"project_id,omitempty" gorm:"type:uuid;index"`
	Tags              JSONB                   `json:"tags,omitempty" gorm:"type:jsonb"`
	Attachments       JSONB                   `json:"attachments,omitempty" gorm:"type:jsonb"`
	FileID            *uuid.UUID              `json:"file_id,omitempty" gorm:"type:uuid"`
	CreatedAt         time.Time               `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt         time.Time               `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`
	DeletedAt         gorm.DeletedAt          `json:"-" gorm:"index"`

	// Relationships
	Wallet        *Wallet              `json:"wallet,omitempty" gorm:"foreignKey:WalletID"`
	Category      *TransactionCategory `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	PaymentMethod *PaymentMethod       `json:"payment_method,omitempty" gorm:"foreignKey:PaymentMethodID"`
	Family        *Family              `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
	User          *User                `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Parent        *Transaction         `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	CreatedBy     *User                `json:"created_by,omitempty" gorm:"foreignKey:CreatedByID"`
	Contact       *Contact             `json:"contact,omitempty" gorm:"foreignKey:ContactID"`
	Location      *Location            `json:"location,omitempty" gorm:"foreignKey:LocationID"`
	Project       *Project             `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
}

// TableName returns the table name for the Transaction model.
func (Transaction) TableName() string {
	return "transactions"
}
