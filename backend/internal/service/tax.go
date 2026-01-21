package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type TaxService interface {
	CreateDocument(ctx context.Context, doc *model.TaxDocument) error
	GetDocuments(ctx context.Context, familyID *uuid.UUID, year string) ([]model.TaxDocument, error)
	DeleteDocument(ctx context.Context, id uuid.UUID) error

	CreateDeduction(ctx context.Context, ded *model.TaxDeduction) error
	GetDeductions(ctx context.Context, familyID *uuid.UUID, year string) ([]model.TaxDeduction, error)
	DeleteDeduction(ctx context.Context, id uuid.UUID) error
}

type taxService struct {
	repo repository.TaxRepository
}

func NewTaxService(repo repository.TaxRepository) TaxService {
	return &taxService{repo: repo}
}

func (s *taxService) CreateDocument(ctx context.Context, doc *model.TaxDocument) error {
	return s.repo.CreateDocument(ctx, doc)
}

func (s *taxService) GetDocuments(ctx context.Context, familyID *uuid.UUID, year string) ([]model.TaxDocument, error) {
	return s.repo.GetDocuments(ctx, familyID, year)
}

func (s *taxService) DeleteDocument(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteDocument(ctx, id)
}

func (s *taxService) CreateDeduction(ctx context.Context, ded *model.TaxDeduction) error {
	return s.repo.CreateDeduction(ctx, ded)
}

func (s *taxService) GetDeductions(ctx context.Context, familyID *uuid.UUID, year string) ([]model.TaxDeduction, error) {
	return s.repo.GetDeductions(ctx, familyID, year)
}

func (s *taxService) DeleteDeduction(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteDeduction(ctx, id)
}
