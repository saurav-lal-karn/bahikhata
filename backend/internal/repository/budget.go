package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type BudgetRepository interface {
	CreateBudget(ctx context.Context, budget *model.Budget) error
	GetBudgetsByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error)
	GetBudgetsByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error)
	GetBudgetByID(ctx context.Context, id uuid.UUID) (*model.Budget, error)
	UpdateBudget(ctx context.Context, budget *model.Budget) error
	DeleteBudget(ctx context.Context, id uuid.UUID) error
	GetBudgets(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error)
}

type budgetRepository struct {
	db *gorm.DB
}

func NewBudgetRepository(db *gorm.DB) BudgetRepository {
	return &budgetRepository{db: db}
}

func (br *budgetRepository) CreateBudget(ctx context.Context, budget *model.Budget) error {
	return br.db.WithContext(ctx).Create(budget).Error
}

func (br *budgetRepository) GetBudgetsByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error) {
	var budgets []model.Budget
	if err := br.db.WithContext(ctx).Where("family_id = ?", familyID).Find(&budgets).Error; err != nil {
		return nil, err
	}
	return budgets, nil
}

func (br *budgetRepository) GetBudgetsByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error) {
	var budgets []model.Budget
	if err := br.db.WithContext(ctx).Where("user_id = ?", userID).Find(&budgets).Error; err != nil {
		return nil, err
	}
	return budgets, nil
}

func (br *budgetRepository) GetBudgetByID(ctx context.Context, id uuid.UUID) (*model.Budget, error) {
	var budget model.Budget
	if err := br.db.WithContext(ctx).Where("id = ?", id).First(&budget).Error; err != nil {
		return nil, err
	}
	return &budget, nil
}

func (br *budgetRepository) UpdateBudget(ctx context.Context, budget *model.Budget) error {
	return br.db.WithContext(ctx).Save(budget).Error
}

func (br *budgetRepository) DeleteBudget(ctx context.Context, id uuid.UUID) error {
	return br.db.WithContext(ctx).Delete(&model.Budget{}, id).Error
}

func (br *budgetRepository) GetBudgets(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error) {
	var budgets []model.Budget
	if err := br.db.WithContext(ctx).Where("family_id = ? AND user_id = ?", family_id, user_id).Preload("Category").Find(&budgets).Error; err != nil {
		return nil, err
	}
	return budgets, nil
}