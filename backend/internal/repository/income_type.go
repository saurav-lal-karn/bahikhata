package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type IncomeTypeRepository interface {
	Create(ctx context.Context, incomeType *model.IncomeType) (*model.IncomeType, error)
	List(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.IncomeType, error)
	GetIncomeTypeById(ctx context.Context, id uuid.UUID) (*model.IncomeType, error)
	GetIncomeTypeByName(ctx context.Context, name string, familyId uuid.UUID) (*model.IncomeType, error)
}

type incomeTypeRepository struct {
	db *gorm.DB
}

func NewIncomeTypeRepository(db *gorm.DB) IncomeTypeRepository {
	return &incomeTypeRepository{db: db}
}

func (r *incomeTypeRepository) Create(ctx context.Context, incomeType *model.IncomeType) (*model.IncomeType, error) {
	if err := r.db.WithContext(ctx).Create(incomeType).Error; err != nil {
		return nil, err
	}
	return incomeType, nil
}

func (r *incomeTypeRepository) List(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.IncomeType, error) {
	var incomeTypes []model.IncomeType
	if err := r.db.WithContext(ctx).Where("is_system = ? OR (family_id = ? AND created_by_id = ?)", true, familyId, userId).Find(&incomeTypes).Error; err != nil {
		return nil, err
	}
	return incomeTypes, nil
}

func (r *incomeTypeRepository) GetIncomeTypeById(ctx context.Context, id uuid.UUID) (*model.IncomeType, error) {
	var incomeType model.IncomeType
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&incomeType).Error; err != nil {
		return nil, err
	}
	return &incomeType, nil
}

func (r *incomeTypeRepository) GetIncomeTypeByName(ctx context.Context, name string, familyId uuid.UUID) (*model.IncomeType, error) {
	var incomeType model.IncomeType
	if err := r.db.WithContext(ctx).Where("name = ? AND family_id = ?", name, familyId).First(&incomeType).Error; err != nil {
		return nil, err
	}
	return &incomeType, nil
}
