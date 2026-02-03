package model

import (
	"time"

	"github.com/google/uuid"
)

type ContactType string

const (
	ContactTypeVendor   ContactType = "VENDOR"
	ContactTypeLender   ContactType = "LENDER"
	ContactTypeEmployer ContactType = "EMPLOYER"
	ContactTypeOther    ContactType = "OTHER"
)

type Contact struct {
	ID       uuid.UUID   `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID uuid.UUID   `json:"family_id" gorm:"type:uuid;not null;index"`
	UserID   *uuid.UUID  `json:"user_id,omitempty" gorm:"type:uuid;index"`
	Name             string      `json:"name" gorm:"type:text;not null"`
	Email            string      `json:"email,omitempty" gorm:"type:text"`
	Phone            string      `json:"phone,omitempty" gorm:"type:text"`
	Address          string      `json:"address,omitempty" gorm:"type:text"`
	AddressLine1     string      `json:"address_line1,omitempty" gorm:"type:text"`
	AddressLine2     string      `json:"address_line2,omitempty" gorm:"type:text"`
	City             string      `json:"city,omitempty" gorm:"type:text"`
	State            string      `json:"state,omitempty" gorm:"type:text"`
	PostalCode       string      `json:"postal_code,omitempty" gorm:"type:text"`
	Country          string      `json:"country,omitempty" gorm:"type:text"`
	TaxID            string      `json:"tax_id,omitempty" gorm:"type:text"`
	Notes            string      `json:"notes,omitempty" gorm:"type:text"`
	Website          string      `json:"website,omitempty" gorm:"type:text"`
	DisplayName      string      `json:"display_name,omitempty" gorm:"type:text"`
	DefaultCategoryID *uuid.UUID  `json:"default_category_id,omitempty" gorm:"type:uuid"`
	DefaultWalletID   *uuid.UUID  `json:"default_wallet_id,omitempty" gorm:"type:uuid"`
	Metadata         JSONB       `json:"metadata,omitempty" gorm:"type:jsonb"`
	IsFavorite       bool        `json:"is_favorite" gorm:"type:boolean;default:false"`
	CreatedByID      *uuid.UUID  `json:"created_by_id,omitempty" gorm:"type:uuid"`
	Type             ContactType `json:"type" gorm:"type:text;not null"`
	IsActive         bool        `json:"is_active" gorm:"type:boolean;default:true"`
	CreatedAt        time.Time   `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt        time.Time   `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Family          *Family              `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
	User            *User                `json:"user,omitempty" gorm:"foreignKey:UserID"`
	CreatedBy       *User                `json:"created_by,omitempty" gorm:"foreignKey:CreatedByID"`
	DefaultCategory *TransactionCategory `json:"default_category,omitempty" gorm:"foreignKey:DefaultCategoryID"`
	DefaultWallet   *Wallet              `json:"default_wallet,omitempty" gorm:"foreignKey:DefaultWalletID"`
}

type ContactCategory struct {
	ContactID  uuid.UUID `json:"contact_id" gorm:"type:uuid;primaryKey"`
	CategoryID uuid.UUID `json:"category_id" gorm:"type:uuid;primaryKey"`
	CreatedAt  time.Time `json:"created_at" gorm:"type:timestamp;default:now()"`

	Contact  *Contact             `json:"contact,omitempty" gorm:"foreignKey:ContactID"`
	Category *TransactionCategory `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
}

type FinancialInstitution struct {
	ID        uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID  uuid.UUID  `json:"family_id" gorm:"type:uuid;not null;index"`
	Name      string     `json:"name" gorm:"type:text;not null"`
	Code      string     `json:"code,omitempty" gorm:"type:text"`
	Website   string     `json:"website,omitempty" gorm:"type:text"`
	CreatedAt time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Family *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

func (Contact) TableName() string {
	return "contacts"
}

func (FinancialInstitution) TableName() string {
	return "financial_institutions"
}
