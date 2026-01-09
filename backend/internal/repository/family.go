package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type FamilyRepository interface {
	CreateFamily(ctx context.Context, family *model.Family) error
	GetFamilyById(ctx context.Context, id uuid.UUID) (*model.Family, error)
	ListFamilies(ctx context.Context) ([]model.Family, error)
	UpdateFamily(ctx context.Context, family *model.Family) error
	DeleteFamily(ctx context.Context, id uuid.UUID) error
}

type familyRepository struct {
	db *gorm.DB
}

func NewFamilyRepository(db *gorm.DB) FamilyRepository {
	return &familyRepository{db: db}
}

func (r *familyRepository) CreateFamily(ctx context.Context, family *model.Family) error {
	if err := r.db.WithContext(ctx).Create(family).Error; err != nil {
		return err
	}
	return nil
}

func (r *familyRepository) GetFamilyById(ctx context.Context, id uuid.UUID) (*model.Family, error) {
	var family model.Family
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&family).Error
	return &family, err
}

func (r *familyRepository) ListFamilies(ctx context.Context) ([]model.Family, error) {
	var families []model.Family
	err := r.db.WithContext(ctx).Find(&families).Error
	return families, err
}

func (r *familyRepository) UpdateFamily(ctx context.Context, family *model.Family) error {
	return r.db.WithContext(ctx).Save(family).Error
}

func (r *familyRepository) DeleteFamily(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Family{}, id).Error
}
