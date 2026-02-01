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
	Name     string      `json:"name" gorm:"type:text;not null"`
	Email    string      `json:"email,omitempty" gorm:"type:text"`
	Phone    string      `json:"phone,omitempty" gorm:"type:text"`
	Address  string      `json:"address,omitempty" gorm:"type:text"`
	Type     ContactType `json:"type" gorm:"type:text;not null"`
	IsActive bool        `json:"is_active" gorm:"type:boolean;default:true"`
	CreatedAt time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Family *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
	User   *User   `json:"user,omitempty" gorm:"foreignKey:UserID"`
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
