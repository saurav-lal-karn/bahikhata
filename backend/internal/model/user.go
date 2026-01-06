package model

import (
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID              uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	FirstName       string         `json:"first_name" gorm:"type:text"`
	LastName        string         `json:"last_name" gorm:"type:text"`
	UserName        string         `json:"user_name" gorm:"type:text"`
	Email           string         `json:"email" gorm:"type:text"`
	Password        string         `json:"password" gorm:"type:text"`
	Role            string         `json:"role" gorm:"type:text;default:'user'"`
	FamilyID        uuid.UUID      `json:"family_id" gorm:"default:null"`
	Country         string         `json:"country" gorm:"type:text;default:null"`
	CreatedBy       uuid.UUID      `json:"created_by" gorm:"default:null"`
	EmailVerified   bool           `json:"email_verified" gorm:"default:false"`
	LastLoggedInAt  time.Time      `json:"last_logged_in_at" gorm:"default:null"`
	EmailVerifiedAt time.Time      `json:"email_verified_at" gorm:"default:null"`
	CreatedAt       time.Time      `json:"created_at" gorm:"type:timestamp"`
	UpdatedAt       time.Time      `json:"updated_at" gorm:"type:timestamp"`
	DeletedAt       gorm.DeletedAt `json:"deleted_at"`
}

func (u *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}
