package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID              uuid.UUID      `json:"id"`
	FirstName       string         `json:"first_name"`
	LastName        string         `json:"last_name"`
	UserName        string         `json:"user_name"`
	Email           string         `json:"email"`
	Password        string         `json:"password"`
	Role            string         `json:"role"`
	FamilyID        uuid.UUID      `json:"family_id"`
	Country         string         `json:"country"`
	CreatedBy       uuid.UUID      `json:"created_by"`
	EmailVerified   bool           `json:"email_verified"`
	LastLoggedInAt  time.Time      `json:"last_logged_in_at"`
	EmailVerifiedAt time.Time      `json:"email_verified_at"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"deleted_at"`
}
