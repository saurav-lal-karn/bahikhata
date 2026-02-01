package model

import (
	"time"

	"github.com/google/uuid"
)

type NetWorthSnapshot struct {
	ID               uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID           *uuid.UUID `json:"user_id,omitempty" gorm:"type:uuid;index"`
	FamilyID         *uuid.UUID `json:"family_id,omitempty" gorm:"type:uuid;index"`
	SnapshotDate     time.Time  `json:"snapshot_date" gorm:"type:date;not null"`
	TotalAssets      float64    `json:"total_assets" gorm:"type:numeric;not null;default:0"`
	TotalLiabilities float64    `json:"total_liabilities" gorm:"type:numeric;not null;default:0"`
	NetWorth         float64    `json:"net_worth" gorm:"type:numeric;not null;default:0"`
	CreatedAt        time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`

	User   *User   `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Family *Family `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
}

type MonthlySummary struct {
	ID                   uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID               *uuid.UUID `json:"user_id,omitempty" gorm:"type:uuid;index"`
	FamilyID             *uuid.UUID `json:"family_id,omitempty" gorm:"type:uuid;index"`
	Month                time.Time  `json:"month" gorm:"type:date;not null;uniqueIndex:idx_user_family_month"`
	TotalIncome          float64    `json:"total_income" gorm:"type:numeric;not null;default:0"`
	TotalExpense         float64    `json:"total_expense" gorm:"type:numeric;not null;default:0"`
	Savings              float64    `json:"savings" gorm:"type:numeric;not null;default:0"`
	TopExpenseCategoryID *uuid.UUID `json:"top_expense_category_id,omitempty" gorm:"type:uuid"`
	CreatedAt            time.Time  `json:"created_at" gorm:"type:timestamp;not null;default:now()"`
	UpdatedAt            time.Time  `json:"updated_at" gorm:"type:timestamp;not null;default:now()"`

	User               *User                `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Family             *Family              `json:"family,omitempty" gorm:"foreignKey:FamilyID"`
	TopExpenseCategory *TransactionCategory `json:"top_expense_category,omitempty" gorm:"foreignKey:TopExpenseCategoryID"`
}

func (NetWorthSnapshot) TableName() string {
	return "net_worth_snapshots"
}

func (MonthlySummary) TableName() string {
	return "monthly_summaries"
}
