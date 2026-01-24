package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type ExpenseCategoryService interface {
	List(ctx context.Context, familyId string) ([]model.ExpenseCategory, error)
	Create(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	Update(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	Delete(ctx context.Context, id string) error
	GetByID(ctx context.Context, id uuid.UUID) (model.ExpenseCategory, error)
}

type expenseCategoryService struct {
	repo repository.ExpenseCategoryRepository
}

func NewExpenseCategoryService(repo repository.ExpenseCategoryRepository) ExpenseCategoryService {
	return &expenseCategoryService{repo: repo}
}

func (s *expenseCategoryService) List(ctx context.Context, familyId string) ([]model.ExpenseCategory, error) {
	return s.repo.List(ctx, familyId)
}

func (s *expenseCategoryService) Create(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	return s.repo.Create(ctx, category)
}

func (s *expenseCategoryService) Update(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	return s.repo.Update(ctx, category)
}

func (s *expenseCategoryService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *expenseCategoryService) GetByID(ctx context.Context, id uuid.UUID) (model.ExpenseCategory, error) {
	return s.repo.GetByID(ctx, id)
}