package repository

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type FamilyRepository interface {
	CreateFamily(family *model.Family) error
	GetFamilyById(id uuid.UUID) (*model.Family, error)
	ListFamilies() ([]model.Family, error)
	UpdateFamily(family *model.Family) error
	DeleteFamily(id uuid.UUID) error
}

type familyRepository struct {
	db *gorm.DB
}

func NewFamilyRepository(db *gorm.DB) FamilyRepository {
	return &familyRepository{db: db}
}

func (r *familyRepository) CreateFamily(family *model.Family) error {
	if err := r.db.Create(family).Error; err != nil {
		return err
	}
	return nil
}

func (r *familyRepository) GetFamilyById(id uuid.UUID) (*model.Family, error) {
	var family model.Family
	err := r.db.Where("id = ?", id).First(&family).Error
	return &family, err
}

func (r *familyRepository) ListFamilies() ([]model.Family, error) {
	var families []model.Family
	err := r.db.Find(&families).Error
	return families, err
}

func (r *familyRepository) UpdateFamily(family *model.Family) error {
	return r.db.Save(family).Error
}

func (r *familyRepository) DeleteFamily(id uuid.UUID) error {
	return r.db.Delete(&model.Family{}, id).Error
}