package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type IncomeTypeService interface {
	CreateIncomeType(ctx context.Context, incomeType *model.IncomeType) (*model.IncomeType, error)
	GetIncomeTypes(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.IncomeType, error)
}

type incomeTypeService struct {
	repo repository.IncomeTypeRepository
}

func NewIncomeTypeService(repo repository.IncomeTypeRepository) IncomeTypeService {
	return &incomeTypeService{repo: repo}
}

func (s *incomeTypeService) CreateIncomeType(ctx context.Context, incomeType *model.IncomeType) (*model.IncomeType, error) {
	_, err := s.repo.Create(ctx, incomeType)
	return incomeType, err
}

func (s *incomeTypeService) GetIncomeTypes(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) ([]model.IncomeType, error) {
	incomeTypes, err := s.repo.List(ctx, familyId, userId)
	if err != nil {
		return nil, err
	}
	return incomeTypes, nil
}