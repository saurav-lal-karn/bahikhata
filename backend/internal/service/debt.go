package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type DebtService interface {
	Create(ctx context.Context, debt *model.Debt) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type debtService struct {
	repo repository.DebtRepository
}

func NewDebtService(repo repository.DebtRepository) DebtService {
	return &debtService{repo: repo}
}

func (s *debtService) Create(ctx context.Context, debt *model.Debt) error {
	return s.repo.Create(ctx, debt)
}

func (s *debtService) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error) {
	return s.repo.List(ctx, familyID, userID)
}

func (s *debtService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
