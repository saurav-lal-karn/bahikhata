package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type ExpenseCategoryService interface {
	GetCategories(ctx context.Context, familyId string) ([]model.ExpenseCategory, error)
	CreateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	UpdateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	DeleteCategory(ctx context.Context, id string) error
	GetCategoryById(ctx context.Context, id uuid.UUID) (model.ExpenseCategory, error)
}

type expenseCategoryService struct {
	repo repository.ExpenseCategoryRepository
}

func NewExpenseCategoryService(repo repository.ExpenseCategoryRepository) ExpenseCategoryService {
	return &expenseCategoryService{repo: repo}
}

func (s *expenseCategoryService) GetCategories(ctx context.Context, familyId string) ([]model.ExpenseCategory, error) {
	return s.repo.GetCategories(ctx, familyId)
}

func (s *expenseCategoryService) CreateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	return s.repo.CreateCategory(ctx, category)
}

func (s *expenseCategoryService) UpdateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	return s.repo.UpdateCategory(ctx, category)
}

func (s *expenseCategoryService) DeleteCategory(ctx context.Context, id string) error {
	return s.repo.DeleteCategory(ctx, id)
}

func (s *expenseCategoryService) GetCategoryById(ctx context.Context, id uuid.UUID) (model.ExpenseCategory, error) {
	return s.repo.GetCategoryById(ctx, id)
}