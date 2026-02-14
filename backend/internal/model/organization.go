package model

import (
	"time"

	"github.com/google/uuid"
)

type Tag struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID  uuid.UUID `json:"family_id" gorm:"type:uuid;not null;index"`
	Name        string     `json:"name" gorm:"type:text;not null"`
	Color       string     `json:"color,omitempty" gorm:"type:text"`
	Icon        string     `json:"icon,omitempty" gorm:"type:text"`
	Description string     `json:"description,omitempty" gorm:"type:text"`
	UsageCount  int        `json:"usage_count" gorm:"type:int;default:0"`
	IsSystem    bool       `json:"is_system" gorm:"type:boolean;default:false"`
	CreatedByID *uuid.UUID `json:"created_by_id,omitempty" gorm:"type:uuid"`
	CreatedAt   time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	CreatedBy *User   `json:"created_by,omitempty" gorm:"foreignKey:CreatedByID"`
	Family    *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

type EntityTag struct {
	EntityID   uuid.UUID `json:"entity_id" gorm:"type:uuid;primaryKey"`
	TagID      uuid.UUID `json:"tag_id" gorm:"type:uuid;primaryKey"`
	EntityType string    `json:"entity_type" gorm:"type:text;primaryKey"`
}

type Project struct {
	ID          uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID    uuid.UUID  `json:"family_id" gorm:"type:uuid;not null;index"`
	Name         string     `json:"name" gorm:"type:text;not null"`
	Description  string     `json:"description,omitempty" gorm:"type:text"`
	Type         string     `json:"type,omitempty" gorm:"type:text"`
	Status       string     `json:"status" gorm:"type:text;default:'ACTIVE'"`
	BudgetAmount float64    `json:"budget_amount,omitempty" gorm:"type:numeric"`
	SpentAmount  float64    `json:"spent_amount" gorm:"type:numeric;default:0"`
	Icon         string     `json:"icon,omitempty" gorm:"type:text"`
	Color        string     `json:"color,omitempty" gorm:"type:text"`
	LinkedGoalID *uuid.UUID `json:"linked_goal_id,omitempty" gorm:"type:uuid"`
	CreatedByID  *uuid.UUID `json:"created_by_id,omitempty" gorm:"type:uuid"`
	StartDate    *time.Time `json:"start_date,omitempty" gorm:"type:date"`
	EndDate      *time.Time `json:"end_date,omitempty" gorm:"type:date"`
	IsActive     bool       `json:"is_active" gorm:"type:boolean;default:true"`
	CreatedAt    time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt    time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	CreatedBy  *User `json:"created_by,omitempty" gorm:"foreignKey:CreatedByID"`
	LinkedGoal *Goal `json:"linked_goal,omitempty" gorm:"foreignKey:LinkedGoalID"`

	Family *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

type Location struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	FamilyID         *uuid.UUID `json:"family_id,omitempty" gorm:"type:uuid;index"`
	Name             string     `json:"name" gorm:"type:text;not null"`
	Type             string     `json:"type,omitempty" gorm:"type:text"`
	Latitude         *float64   `json:"latitude,omitempty" gorm:"type:numeric"`
	Longitude        *float64   `json:"longitude,omitempty" gorm:"type:numeric"`
	Address          string     `json:"address,omitempty" gorm:"type:text"`
	City             string     `json:"city,omitempty" gorm:"type:text"`
	State            string     `json:"state,omitempty" gorm:"type:text"`
	Country          string     `json:"country,omitempty" gorm:"type:text"`
	PostalCode       string     `json:"postal_code,omitempty" gorm:"type:text"`
	GooglePlaceID    string     `json:"google_place_id,omitempty" gorm:"type:text"`
	ContactID        *uuid.UUID `json:"contact_id,omitempty" gorm:"type:uuid"`
	TransactionCount int        `json:"transaction_count" gorm:"type:int;default:0"`
	LastVisited      *time.Time `json:"last_visited,omitempty" gorm:"type:timestamp"`
	CreatedAt        time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	Family  *Family  `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
	Contact *Contact `json:"contact,omitempty" gorm:"foreignKey:ContactID"`
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

func (ContactCategory) TableName() string {
	return "contact_categories"
}
