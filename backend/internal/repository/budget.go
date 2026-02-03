package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type BudgetRepository interface {
	Create(ctx context.Context, budget *model.Budget) error
	GetByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error)
	GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Budget, error)
	Update(ctx context.Context, budget *model.Budget) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error)

	// Budget Periods
	GetPeriods(ctx context.Context, budgetID uuid.UUID) ([]model.BudgetPeriod, error)

	// Budget Alerts
	GetAlerts(ctx context.Context, familyID *uuid.UUID) ([]model.BudgetAlert, error)
	AcknowledgeAlert(ctx context.Context, alertID uuid.UUID) error
}

type budgetRepository struct {
	db *gorm.DB
}

func NewBudgetRepository(db *gorm.DB) BudgetRepository {
	return &budgetRepository{db: db}
}

func (br *budgetRepository) Create(ctx context.Context, budget *model.Budget) error {
	return br.db.WithContext(ctx).Create(budget).Error
}

func (br *budgetRepository) GetByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error) {
	var budgets []model.Budget
	if err := br.db.WithContext(ctx).Where("family_id = ?", familyID).Find(&budgets).Error; err != nil {
		return nil, err
	}
	return budgets, nil
}

func (br *budgetRepository) GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error) {
	var budgets []model.Budget
	if err := br.db.WithContext(ctx).Where("user_id = ?", userID).Find(&budgets).Error; err != nil {
		return nil, err
	}
	return budgets, nil
}

func (br *budgetRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Budget, error) {
	var budget model.Budget
	if err := br.db.WithContext(ctx).Where("id = ?", id).First(&budget).Error; err != nil {
		return nil, err
	}
	return &budget, nil
}

func (br *budgetRepository) Update(ctx context.Context, budget *model.Budget) error {
	return br.db.WithContext(ctx).Save(budget).Error
}

func (br *budgetRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return br.db.WithContext(ctx).Delete(&model.Budget{}, id).Error
}

func (br *budgetRepository) List(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error) {
	var budgets []model.Budget
	if err := br.db.WithContext(ctx).Where("family_id = ? AND user_id = ?", family_id, user_id).Preload("Category").Find(&budgets).Error; err != nil {
		return nil, err
	}
	return budgets, nil
}

func (br *budgetRepository) GetPeriods(ctx context.Context, budgetID uuid.UUID) ([]model.BudgetPeriod, error) {
	var periods []model.BudgetPeriod
	if err := br.db.WithContext(ctx).Where("budget_id = ?", budgetID).Order("start_date DESC").Find(&periods).Error; err != nil {
		return nil, err
	}
	return periods, nil
}

func (br *budgetRepository) GetAlerts(ctx context.Context, familyID *uuid.UUID) ([]model.BudgetAlert, error) {
	var alerts []model.BudgetAlert
	query := br.db.WithContext(ctx).Joins("JOIN budgets ON budgets.id = budget_alerts.budget_id")
	if familyID != nil {
		query = query.Where("budgets.family_id = ?", familyID)
	}
	if err := query.Where("budget_alerts.triggered_at IS NOT NULL").Order("budget_alerts.triggered_at DESC").Preload("Budget").Preload("Period").Find(&alerts).Error; err != nil {
		return nil, err
	}
	return alerts, nil
}

func (br *budgetRepository) AcknowledgeAlert(ctx context.Context, alertID uuid.UUID) error {
	// Mark alert as acknowledged by setting triggered_at to nil or add an acknowledged_at field
	// For now, we'll delete the alert as acknowledgment
	return br.db.WithContext(ctx).Delete(&model.BudgetAlert{}, "id = ?", alertID).Error
}