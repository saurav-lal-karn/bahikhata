package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

// TransactionCategoryRepository defines the operations for transaction category data access.
type TransactionCategoryRepository interface {
	Create(ctx context.Context, category *model.TransactionCategory) (*model.TransactionCategory, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.TransactionCategory, error)
	List(ctx context.Context, familyID uuid.UUID, includeSystem bool, type_ string) ([]model.TransactionCategory, error)
	Update(ctx context.Context, id uuid.UUID, category *model.TransactionCategory) (*model.TransactionCategory, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByName(ctx context.Context, name string, type_ model.TransactionCategoryType, familyID uuid.UUID) (*model.TransactionCategory, error)
}

type transactionCategoryRepository struct {
	db *gorm.DB
}

// NewTransactionCategoryRepository creates a new instance of transactionCategoryRepository.
func NewTransactionCategoryRepository(db *gorm.DB) TransactionCategoryRepository {
	return &transactionCategoryRepository{db: db}
}

func (r *transactionCategoryRepository) Create(ctx context.Context, category *model.TransactionCategory) (*model.TransactionCategory, error) {
	if err := r.db.WithContext(ctx).Create(category).Error; err != nil {
		return nil, fmt.Errorf("failed to create transaction category: %w", err)
	}
	return category, nil
}

func (r *transactionCategoryRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.TransactionCategory, error) {
	var category model.TransactionCategory
	if err := r.db.WithContext(ctx).Preload("Parent").First(&category, id).Error; err != nil {
		return nil, fmt.Errorf("failed to get transaction category %s: %w", id, err)
	}
	return &category, nil
}

func (r *transactionCategoryRepository) List(ctx context.Context, familyID uuid.UUID, includeSystem bool, type_ string) ([]model.TransactionCategory, error) {
	var categories []model.TransactionCategory
	query := r.db.WithContext(ctx)

	if includeSystem {
		query = query.Where("family_id = ? OR is_system = true", familyID)
	} else {
		query = query.Where("family_id = ?", familyID)
	}

	if type_ != "" {
		query = query.Where("type = ?", type_)
	}

	if err := query.Preload("Parent").Order("name ASC").Find(&categories).Error; err != nil {
		return nil, fmt.Errorf("failed to list transaction categories: %w", err)
	}
	return categories, nil
}

func (r *transactionCategoryRepository) Update(ctx context.Context, id uuid.UUID, category *model.TransactionCategory) (*model.TransactionCategory, error) {
	result := r.db.WithContext(ctx).Model(&model.TransactionCategory{}).Where("id = ?", id).Updates(category)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update transaction category %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return r.GetByID(ctx, id)
}

func (r *transactionCategoryRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&model.TransactionCategory{}, id)
	if result.Error != nil {
		return fmt.Errorf("failed to delete transaction category %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *transactionCategoryRepository) GetByName(ctx context.Context, name string, type_ model.TransactionCategoryType, familyID uuid.UUID) (*model.TransactionCategory, error) {
	var category model.TransactionCategory
	if err := r.db.WithContext(ctx).
		Where("name = ? AND type = ? AND (family_id = ? OR is_system = true)", name, type_, familyID).
		First(&category).Error; err != nil {
		return nil, fmt.Errorf("failed to get transaction category by name %s: %w", name, err)
	}
	return &category, nil
}
