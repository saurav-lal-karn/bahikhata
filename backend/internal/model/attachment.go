package model

import (
	"time"

	"github.com/google/uuid"
)

type Attachment struct {
	ID         uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID   uuid.UUID  `json:"family_id" gorm:"type:uuid;not null;index"`
	FileName   string     `json:"file_name" gorm:"type:text;not null"`
	FilePath   string     `json:"file_path" gorm:"type:text;not null"`
	FileType   string     `json:"file_type,omitempty" gorm:"type:text"`
	FileSize   int        `json:"file_size,omitempty" gorm:"type:integer"`
	EntityType string     `json:"entity_type" gorm:"type:text;not null"` // TRANSACTION, INSURANCE, etc.
	EntityID   uuid.UUID  `json:"entity_id" gorm:"type:uuid;not null;index"`
	UploadedBy *uuid.UUID `json:"uploaded_by,omitempty" gorm:"type:uuid;index"`
	CreatedAt  time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	// Associations
	User *User `json:"-" gorm:"foreignKey:UploadedBy"`
}

func (Attachment) TableName() string {
	return "attachments"
}
