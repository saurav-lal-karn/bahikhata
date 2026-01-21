package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Budget struct {
	ID          	uuid.UUID 		`json:"id" gorm:"type:uuid;primaryKey"`
	FamilyID 		*uuid.UUID 		`json:"family_id"`
	UserID	 		*uuid.UUID 		`json:"user_id"`
	CategoryID 		*uuid.UUID 		`json:"category_id"`
	AmountLimit 	float64 		`json:"amount_limit"`
	Period 			string 			`json:"period"`
	AlertThreshold 	float64 		`json:"alert_threshold"`
	CreatedAt   	time.Time 		`json:"created_at"`
	UpdatedAt 		time.Time 		`json:"updated_at"`
	DeletedAt 		gorm.DeletedAt 	`json:"deleted_at"`

	Family 			*Family 		`json:"family" gorm:"foreignKey:FamilyID"`
	User 			*User 			`json:"creator" gorm:"foreignKey:UserID"`
	Category 		*ExpenseCategory 	`json:"category" gorm:"foreignKey:CategoryID"`
}

func(Budget) TableName() string {
	return "budgets"
}