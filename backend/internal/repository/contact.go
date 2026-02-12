package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type ContactRepository interface {
	Create(ctx context.Context, contact *model.Contact) error
	GetByID(ctx context.Context, id uuid.UUID) (*model.Contact, error)
	ListByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Contact, error)
	Update(ctx context.Context, contact *model.Contact) error
	Delete(ctx context.Context, id uuid.UUID) error
	GetByName(ctx context.Context, name string, familyID uuid.UUID) (*model.Contact, error)
}

type contactRepo struct {
	db *gorm.DB
}

func NewContactRepository(db *gorm.DB) ContactRepository {
	return &contactRepo{db: db}
}

func (r *contactRepo) Create(ctx context.Context, contact *model.Contact) error {
	return r.db.WithContext(ctx).Create(contact).Error
}

func (r *contactRepo) GetByID(ctx context.Context, id uuid.UUID) (*model.Contact, error) {
	var contact model.Contact
	if err := r.db.WithContext(ctx).First(&contact, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &contact, nil
}

func (r *contactRepo) ListByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Contact, error) {
	var contacts []model.Contact
	if err := r.db.WithContext(ctx).Where("family_id = ?", familyID).Find(&contacts).Error; err != nil {
		return nil, err
	}
	return contacts, nil
}

func (r *contactRepo) Update(ctx context.Context, contact *model.Contact) error {
	return r.db.WithContext(ctx).Save(contact).Error
}

func (r *contactRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Contact{}, "id = ?", id).Error
}

func (r *contactRepo) GetByName(ctx context.Context, name string, familyID uuid.UUID) (*model.Contact, error) {
	var contact model.Contact
	if err := r.db.WithContext(ctx).Where("name = ? AND family_id = ?", name, familyID).First(&contact).Error; err != nil {
		return nil, err
	}
	return &contact, nil
}
