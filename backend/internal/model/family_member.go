package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FamilyMember struct {
	ID            uuid.UUID `json:"id"`
	FamilyID      uuid.UUID `json:"family_id"`
	UserID        uuid.UUID `json:"user_id"`
	Role          string    `json:"role"`
	CreatedByUserID uuid.UUID `json:"created_by_user_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"deleted_at"`
	User          User      `json:"user"`
	CreatedByUser User      `json:"created_by_user"`
	Family        Family    `json:"family" gorm:"foreignKey:FamilyID;references:ID"`
}

func (FamilyMember) TableName() string {
	return "family_members"
}
