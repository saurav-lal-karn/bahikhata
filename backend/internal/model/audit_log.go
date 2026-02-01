package model

import (
	"time"

	"github.com/google/uuid"
)

type AuditLog struct {
	ID         uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID     *uuid.UUID `json:"user_id,omitempty" gorm:"type:uuid;index"`
	FamilyID   *uuid.UUID `json:"family_id,omitempty" gorm:"type:uuid;index"`
	Action     string     `json:"action" gorm:"type:text;not null"`
	EntityType string     `json:"entity_type" gorm:"type:text;not null"`
	EntityID   *uuid.UUID `json:"entity_id,omitempty" gorm:"type:uuid;index"`
	OldValues  JSONB      `json:"old_values,omitempty" gorm:"type:jsonb"`
	NewValues  JSONB      `json:"new_values,omitempty" gorm:"type:jsonb"`
	IPAddress  string     `json:"ip_address,omitempty" gorm:"type:text"`
	UserAgent  string     `json:"user_agent,omitempty" gorm:"type:text"`
	CreatedAt  time.Time  `json:"created_at" gorm:"type:timestamp;primaryKey;default:now()"`

	User   *User   `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Family *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

func (AuditLog) TableName() string {
	return "audit_logs"
}
