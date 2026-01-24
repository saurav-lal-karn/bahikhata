package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type TaxRepository interface {
	CreateDocument(ctx context.Context, doc *model.TaxDocument) error
	ListDocuments(ctx context.Context, familyID *uuid.UUID, year string) ([]model.TaxDocument, error)
	DeleteDocument(ctx context.Context, id uuid.UUID) error

	CreateDeduction(ctx context.Context, ded *model.TaxDeduction) error
	ListDeductions(ctx context.Context, familyID *uuid.UUID, year string) ([]model.TaxDeduction, error)
	DeleteDeduction(ctx context.Context, id uuid.UUID) error
}

type taxRepository struct {
	db *gorm.DB
}

func NewTaxRepository(db *gorm.DB) TaxRepository {
	return &taxRepository{db: db}
}

// Documents
func (r *taxRepository) CreateDocument(ctx context.Context, doc *model.TaxDocument) error {
	return r.db.WithContext(ctx).Create(doc).Error
}

func (r *taxRepository) ListDocuments(ctx context.Context, familyID *uuid.UUID, year string) ([]model.TaxDocument, error) {
	var docs []model.TaxDocument
	query := r.db.WithContext(ctx).Where("family_id = ?", familyID)
	if year != "" {
		query = query.Where("year = ?", year)
	}
	if err := query.Find(&docs).Error; err != nil {
		return nil, err
	}
	return docs, nil
}

func (r *taxRepository) DeleteDocument(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.TaxDocument{}, id).Error
}

// Deductions
func (r *taxRepository) CreateDeduction(ctx context.Context, ded *model.TaxDeduction) error {
	return r.db.WithContext(ctx).Create(ded).Error
}

func (r *taxRepository) ListDeductions(ctx context.Context, familyID *uuid.UUID, year string) ([]model.TaxDeduction, error) {
	var deds []model.TaxDeduction
	query := r.db.WithContext(ctx).Where("family_id = ?", familyID)
	if year != "" {
		query = query.Where("year = ?", year)
	}
	if err := query.Find(&deds).Error; err != nil {
		return nil, err
	}
	return deds, nil
}

func (r *taxRepository) DeleteDeduction(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.TaxDeduction{}, id).Error
}
