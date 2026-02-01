package model

import (
	"time"

	"github.com/google/uuid"
)

type Tag struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID  uuid.UUID `json:"family_id" gorm:"type:uuid;not null;index"`
	Name      string    `json:"name" gorm:"type:text;not null"`
	Color     string    `json:"color,omitempty" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	Family *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

type EntityTag struct {
	EntityID   uuid.UUID `json:"entity_id" gorm:"type:uuid;primaryKey"`
	TagID      uuid.UUID `json:"tag_id" gorm:"type:uuid;primaryKey"`
	EntityType string    `json:"entity_type" gorm:"type:text;primaryKey"`

	Tag *Tag `json:"tag,omitempty" gorm:"foreignKey:TagID"`
}

type Project struct {
	ID          uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID    uuid.UUID  `json:"family_id" gorm:"type:uuid;not null;index"`
	Name        string     `json:"name" gorm:"type:text;not null"`
	Description string     `json:"description,omitempty" gorm:"type:text"`
	StartDate   *time.Time `json:"start_date,omitempty" gorm:"type:date"`
	EndDate     *time.Time `json:"end_date,omitempty" gorm:"type:date"`
	IsActive    bool       `json:"is_active" gorm:"type:boolean;default:true"`
	CreatedAt   time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt   time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Family *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

type Location struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name      string    `json:"name" gorm:"type:text;not null"`
	Latitude  *float64  `json:"latitude,omitempty" gorm:"type:numeric"`
	Longitude *float64  `json:"longitude,omitempty" gorm:"type:numeric"`
	Address   string    `json:"address,omitempty" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
}

func (Tag) TableName() string {
	return "tags"
}

func (EntityTag) TableName() string {
	return "entity_tags"
}

func (Project) TableName() string {
	return "projects"
}

func (Location) TableName() string {
	return "locations"
}
