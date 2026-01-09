package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RefreshToken struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID       uuid.UUID      `json:"user_id" gorm:"type:uuid;not null"`
	RefreshToken string         `json:"refresh_token" gorm:"type:text;not null"`
	CreatedAt    time.Time      `json:"created_at" gorm:"type:timestamp"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"type:timestamp"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

func (RefreshToken) TableName() string {
	return "user_refresh_tokens"
}
