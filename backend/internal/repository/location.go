package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type LocationRepository interface {
	Create(ctx context.Context, location *model.Location) error
	List(ctx context.Context) ([]model.Location, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Location, error)
	Update(ctx context.Context, location *model.Location) error
	Delete(ctx context.Context, id uuid.UUID) error
	ListByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Location, error)
}

type locationRepo struct {
	db *gorm.DB
}

func NewLocationRepository(db *gorm.DB) LocationRepository {
	return &locationRepo{db: db}
}

func (r *locationRepo) Create(ctx context.Context, location *model.Location) error {
	return r.db.WithContext(ctx).Create(location).Error
}

func (r *locationRepo) List(ctx context.Context) ([]model.Location, error) {
	var locations []model.Location
	if err := r.db.WithContext(ctx).Find(&locations).Error; err != nil {
		return nil, err
	}
	return locations, nil
}

func (r *locationRepo) ListByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Location, error) {
	var locations []model.Location
	if err := r.db.WithContext(ctx).Where("family_id = ?", familyID).Find(&locations).Error; err != nil {
		return nil, err
	}
	return locations, nil
}

func (r *locationRepo) GetByID(ctx context.Context, id uuid.UUID) (*model.Location, error) {
	var location model.Location
	if err := r.db.WithContext(ctx).First(&location, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &location, nil
}

func (r *locationRepo) Update(ctx context.Context, location *model.Location) error {
	return r.db.WithContext(ctx).Save(location).Error
}

func (r *locationRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Location{}, "id = ?", id).Error
}
