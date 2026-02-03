package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Notification struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID    uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index"`
	FamilyID  uuid.UUID      `json:"family_id" gorm:"type:uuid;not null;index"`
	Title     string         `json:"title" gorm:"type:text;not null"`
	Message   string         `json:"message" gorm:"type:text;not null"`
	Status    string         `json:"status" gorm:"type:text;not null;default:unread"` // unread, read
	CreatedAt time.Time      `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"type:timestamp"`

	// Type can be added via migration (BUDGET_ALERT, BILL_DUE, GOAL_ACHIEVED, SYSTEM). Omitted for existing schema.

	User   *User   `json:"-" gorm:"foreignKey:UserID"`
	Family *Family `json:"-" gorm:"foreignKey:FamilyID"`
}

func (Notification) TableName() string {
	return "notifications"
}
