package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type ExpenseCategoryRepository interface {
	List(ctx context.Context, familyId string) ([]model.ExpenseCategory, error)
	Create(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	Update(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	Delete(ctx context.Context, id string) error
	GetByID(ctx context.Context, id uuid.UUID) (model.ExpenseCategory, error)
	GetByName(ctx context.Context, name string, familyId uuid.UUID) (model.ExpenseCategory, error)
}

type expenseCategoryRepository struct {
	db *gorm.DB
}

func NewExpenseCategoryRepository(db *gorm.DB) ExpenseCategoryRepository {
	return &expenseCategoryRepository{db: db}
}

func (r *expenseCategoryRepository) List(ctx context.Context, familyId string) ([]model.ExpenseCategory, error) {
	var categories []model.ExpenseCategory
	if err := r.db.WithContext(ctx).Where("family_id = ? OR is_system = ?", familyId, true).Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *expenseCategoryRepository) Create(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	if err := r.db.WithContext(ctx).Create(&category).Error; err != nil {
		return model.ExpenseCategory{}, err
	}
	return category, nil
}

func (r *expenseCategoryRepository) Update(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	if err := r.db.WithContext(ctx).Save(&category).Error; err != nil {
		return model.ExpenseCategory{}, err
	}
	return category, nil
}

func (r *expenseCategoryRepository) Delete(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Delete(&model.ExpenseCategory{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (r *expenseCategoryRepository) GetByID(ctx context.Context, id uuid.UUID) (model.ExpenseCategory, error) {
	var category model.ExpenseCategory
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&category).Error; err != nil {
		return model.ExpenseCategory{}, err
	}
	return category, nil
}

func (r *expenseCategoryRepository) GetByName(ctx context.Context, name string, familyId uuid.UUID) (model.ExpenseCategory, error) {
	var category model.ExpenseCategory
	if err := r.db.WithContext(ctx).Where("name = ? AND family_id = ?", name, familyId).First(&category).Error; err != nil {
		return model.ExpenseCategory{}, err
	}
	return category, nil
}