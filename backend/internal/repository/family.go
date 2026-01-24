package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type FamilyRepository interface {
	Create(ctx context.Context, family *model.Family) error
	GetByID(ctx context.Context, id uuid.UUID) (*model.Family, error)
	List(ctx context.Context) ([]model.Family, error)
	Update(ctx context.Context, family *model.Family) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type familyRepository struct {
	db *gorm.DB
}

func NewFamilyRepository(db *gorm.DB) FamilyRepository {
	return &familyRepository{db: db}
}

func (r *familyRepository) Create(ctx context.Context, family *model.Family) error {
	if err := r.db.WithContext(ctx).Create(family).Error; err != nil {
		return err
	}
	return nil
}

func (r *familyRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Family, error) {
	var family model.Family
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&family).Error
	return &family, err
}

func (r *familyRepository) List(ctx context.Context) ([]model.Family, error) {
	var families []model.Family
	err := r.db.WithContext(ctx).Find(&families).Error
	return families, err
}

func (r *familyRepository) Update(ctx context.Context, family *model.Family) error {
	return r.db.WithContext(ctx).Save(family).Error
}

func (r *familyRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Family{}, id).Error
}
