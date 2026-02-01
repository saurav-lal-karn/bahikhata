package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Goal struct {
	ID            uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	Name          string         `json:"name"`
	CurrentAmount float64        `json:"current_amount"`
	TargetAmount  float64        `json:"target_amount"`
	Description   string         `json:"description"`
	IconName      string         `json:"icon_name"`
	Color         string         `json:"color"`
	Deadline      time.Time      `json:"deadline"`
	FamilyID      *uuid.UUID     `json:"family_id"`
	UserID        *uuid.UUID     `json:"user_id"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"deleted_at"`

	Family        *Family            `json:"family" gorm:"foreignKey:FamilyID"`
	User          *User              `json:"creator" gorm:"foreignKey:UserID"`
	Contributions []GoalContribution `json:"contributions" gorm:"foreignKey:GoalID"`
}

type GoalContribution struct {
	ID               uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	GoalID           uuid.UUID  `json:"goal_id" gorm:"type:uuid;not null;index"`
	TransactionID    *uuid.UUID `json:"transaction_id,omitempty" gorm:"type:uuid;index"`
	Amount           float64    `json:"amount" gorm:"type:numeric;not null"`
	ContributionDate time.Time  `json:"contribution_date" gorm:"type:timestamp;not null;default:now()"`
	CreatedAt        time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt        time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Transaction *Transaction `json:"transaction,omitempty" gorm:"foreignKey:TransactionID"`
}

func (Goal) TableName() string {
	return "goals"
}

func (GoalContribution) TableName() string {
	return "goal_contributions"
}
	