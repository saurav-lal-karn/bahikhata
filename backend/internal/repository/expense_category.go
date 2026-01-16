package repository

import (
	"context"

	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type ExpenseCategoryRepository interface {
	GetCategories(ctx context.Context, familyId string) ([]model.ExpenseCategory, error)
	CreateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	UpdateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	DeleteCategory(ctx context.Context, id string) error
	GetCategoryById(ctx context.Context, id string) (model.ExpenseCategory, error)
}

type expenseCategoryRepository struct {
	db *gorm.DB
}

func NewExpenseCategoryRepository(db *gorm.DB) ExpenseCategoryRepository {
	return &expenseCategoryRepository{db: db}
}

func (r *expenseCategoryRepository) GetCategories(ctx context.Context, familyId string) ([]model.ExpenseCategory, error) {
	var categories []model.ExpenseCategory
	if err := r.db.WithContext(ctx).Where("family_id = ? OR is_system = ?", familyId, true).Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *expenseCategoryRepository) CreateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	if err := r.db.WithContext(ctx).Create(&category).Error; err != nil {
		return model.ExpenseCategory{}, err
	}
	return category, nil
}

func (r *expenseCategoryRepository) UpdateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	if err := r.db.WithContext(ctx).Save(&category).Error; err != nil {
		return model.ExpenseCategory{}, err
	}
	return category, nil
}

func (r *expenseCategoryRepository) DeleteCategory(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Delete(&model.ExpenseCategory{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (r *expenseCategoryRepository) GetCategoryById(ctx context.Context, id string) (model.ExpenseCategory, error) {
	var category model.ExpenseCategory
	if err := r.db.WithContext(ctx).First(&category, id).Error; err != nil {
		return model.ExpenseCategory{}, err
	}
	return category, nil
}