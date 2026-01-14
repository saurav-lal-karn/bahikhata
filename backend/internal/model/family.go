package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Family struct {
	ID            		uuid.UUID      	`json:"id" gorm:"type:uuid;primary_key"`
	Name           		string         	`json:"name" gorm:"type:text"`
	Currency       		string         	`json:"currency" gorm:"type:text"`
	Locale         		string         	`json:"locale" gorm:"type:text"`
	BudgetAlerts   		bool           	`json:"budget_alerts" gorm:"type:boolean"`
	WeeklyReport   		bool           	`json:"weekly_report" gorm:"type:boolean"`
	HidePortfolio  		bool           	`json:"hide_portfolio" gorm:"type:boolean"`
	RestrictDeletion 	bool           	`json:"restrict_deletion" gorm:"type:boolean"`
	HideIncome 			bool           	`json:"hide_income" gorm:"type:boolean"`
	CreatedBy     		uuid.UUID       `json:"created_by" gorm:"default:null"`
	CreatedAt     		time.Time      	`json:"created_at" gorm:"type:timestamp"`
	UpdatedAt     		time.Time      	`json:"updated_at" gorm:"type:timestamp"`
	DeletedAt     		gorm.DeletedAt 	`json:"deleted_at" gorm:"type:timestamp"`
}

// TableName specifies the table name for Family
func (Family) TableName() string {
	return "family"
}

type FamilyStats struct {
	TotalUsers         int     `json:"total_users"`
	TotalMembers       int     `json:"total_members"`
	TotalAdministrators int     `json:"total_administrators"`
	TotalPendingInvites int     `json:"total_pending_invites"`
	TotalLedgers       int     `json:"total_ledgers"`
	TotalTransactions  int     `json:"total_transactions"`
	TotalAmount        float64 `json:"total_amount"`
}