package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Budget represents a budget for a specific category in the system.
// It belongs to a user within a family and has an associated category.
// It tracks the budget of the category for a specific period.
type Budget struct {
	// ID is the unique identifier for the budget. (UUID v4)
	ID          	uuid.UUID 		`json:"id" gorm:"type:uuid;primaryKey"`

	// AmountLimit is the amount limit for the budget.
	AmountLimit 	float64 		`json:"amount_limit" gorm:"type:decimal(10,2);not null;gt:0"`

	// Period is the period for the budget. (e.g. "monthly", "yearly")
	Period 			string 			`json:"period" gorm:"type:varchar(20);not null"`

	// AlertThreshold is the alert threshold for the budget.
	AlertThreshold 	float64 		`json:"alert_threshold" gorm:"type:decimal(10,2)"`

	// FamilyID is the unique identifier for the family to which the budget belongs. (UUID v4)
	FamilyID 		uuid.UUID 		`json:"family_id" gorm:"type:uuid;not null;index"`

	// UserID is the unique identifier for the user to which the budget belongs. (UUID v4)
	UserID	 		uuid.UUID 		`json:"user_id" gorm:"type:uuid;not null;index"`

	// CategoryID is the unique identifier for the category to which the budget belongs. (UUID v4)
	CategoryID 		uuid.UUID 		`json:"category_id" gorm:"type:uuid;not null;index"`

	// CreatedAt is the timestamp when the budget was created.
	CreatedAt   	time.Time 		`json:"created_at" gorm:"autoCreateTime"`

	// UpdatedAt is the timestamp when the budget was updated.
	UpdatedAt 		time.Time 		`json:"updated_at" gorm:"autoUpdateTime"`

	// DeletedAt is the timestamp when the budget was deleted.
	DeletedAt 		gorm.DeletedAt 	`json:"-" gorm:"index"`

	// Relationships (use pointers to allow nil values, exclude from direct JSON serialization)
	Family   *Family              `json:"-" gorm:"foreignKey:FamilyID"`
	User     *User                `json:"-" gorm:"foreignKey:UserID"`
	Category *TransactionCategory `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Periods  []BudgetPeriod       `json:"periods,omitempty" gorm:"foreignKey:BudgetID"`
	Alerts   []BudgetAlert        `json:"alerts,omitempty" gorm:"foreignKey:BudgetID"`
}

type BudgetPeriod struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	BudgetID    uuid.UUID `json:"budget_id" gorm:"type:uuid;not null;index"`
	StartDate   time.Time `json:"start_date" gorm:"type:date;not null"`
	EndDate     time.Time `json:"end_date" gorm:"type:date;not null"`
	SpentAmount float64   `json:"spent_amount" gorm:"type:numeric;not null;default:0"`
	IsClosed    bool      `json:"is_closed" gorm:"type:boolean;not null;default:false"`
	CreatedAt   time.Time `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	Budget *Budget `json:"budget,omitempty" gorm:"foreignKey:BudgetID"`
}

type BudgetAlert struct {
	ID                  uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	BudgetID            uuid.UUID  `json:"budget_id" gorm:"type:uuid;not null;index"`
	PeriodID            *uuid.UUID `json:"period_id,omitempty" gorm:"type:uuid;index"`
	ThresholdPercentage float64    `json:"threshold_percentage" gorm:"type:numeric;not null"`
	TriggeredAt         *time.Time `json:"triggered_at,omitempty" gorm:"type:timestamp"`
	Message             string     `json:"message,omitempty" gorm:"type:text"`
	CreatedAt           time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	Budget *Budget       `json:"budget,omitempty" gorm:"foreignKey:BudgetID"`
	Period *BudgetPeriod `json:"period,omitempty" gorm:"foreignKey:PeriodID"`
}

func(Budget) TableName() string {
	return "budgets"
}