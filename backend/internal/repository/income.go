package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type IncomeRepository interface {
	Create(ctx context.Context, income *model.Income) (*model.Income, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Income, error)
	List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Income, error)
	Update(ctx context.Context,id uuid.UUID, income *model.Income) (*model.Income, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (error)
}

type incomeRepository struct {
	db *gorm.DB
}

func NewIncomeRepository(db *gorm.DB) IncomeRepository {
	return &incomeRepository{db: db}
}

func (r *incomeRepository) Create(ctx context.Context, income *model.Income) (*model.Income, error) {
	if err := r.db.WithContext(ctx).Create(income).Error; err != nil {
		return nil, fmt.Errorf("Failed to create income %s: %w", income.ID, err)
	}
	return income, nil
}

func (r *incomeRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Income, error) {
	var income model.Income
	if err := r.db.WithContext(ctx).First(&income, id).Error; err != nil {
		return nil, fmt.Errorf("Failed to get income %s: %w", id, err)
	}
	return &income, nil
}

func (r *incomeRepository) List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Income, error) {
	var incomes []model.Income
	if err := r.db.WithContext(ctx).
		Where("family_id = ? OR created_by_id = ?", familyID, userId).
		Preload("Source").
		Preload("Wallet").
		Find(&incomes).
		Error; err != nil {
		return nil, fmt.Errorf("Failed to list incomes for family %s: %w", familyID, err)
	}
	return incomes, nil
}

func (r *incomeRepository) Update(ctx context.Context,id uuid.UUID, income *model.Income) (*model.Income, error) {
	result := r.db.WithContext(ctx).Model(&model.Income{}).Where("id = ?", id).Updates(income)
	if result.Error != nil {
		return nil, fmt.Errorf("Failed to update income %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	// Fetch and return the updated income
	return r.GetByID(ctx, id)
}

func (r *incomeRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&model.Income{}, id)
	if result.Error != nil {
		return fmt.Errorf("Failed to delete income %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *incomeRepository) GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (error) {
	return nil
}
