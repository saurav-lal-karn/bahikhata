package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type IncomeRepository interface {
	Create(ctx context.Context, income *model.Income) error
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

func (r *incomeRepository) Create(ctx context.Context, income *model.Income) error {
	return r.db.WithContext(ctx).Create(income).Error
}

func (r *incomeRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Income, error) {
	var income model.Income
	if err := r.db.WithContext(ctx).First(&income, id).Error; err != nil {
		return nil, err
	}
	return &income, nil
}

func (r *incomeRepository) List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Income, error) {
	var incomes []model.Income
	if err := r.db.WithContext(ctx).Preload("Source").Preload("Wallet").Where("family_id = ? OR created_by_id = ?", familyID, userId).Find(&incomes).Error; err != nil {
		return nil, err
	}
	return incomes, nil
}

func (r *incomeRepository) Update(ctx context.Context,id uuid.UUID, income *model.Income) (*model.Income, error) {
	income.ID = id
	if err := r.db.WithContext(ctx).Save(income).Error; err != nil {
		return nil, err
	}
	return income, nil
}

func (r *incomeRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Income{}, id).Error
}

func (r *incomeRepository) GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (error) {
	return nil
}
