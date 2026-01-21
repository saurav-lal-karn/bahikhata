package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type BudgetService interface {
	CreateBudget(ctx context.Context, budget *model.Budget) error
	GetBudgetsByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error)
	GetBudgetsByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error)
	GetBudgetByID(ctx context.Context, id uuid.UUID) (*model.Budget, error)
	UpdateBudget(ctx context.Context, budget *model.Budget) error
	DeleteBudget(ctx context.Context, id uuid.UUID) error
	GetBudgets(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error)
}

type budgetService struct {
	repo repository.BudgetRepository
}

func NewBudgetService(repo repository.BudgetRepository) BudgetService {
	return &budgetService{repo: repo}
}

func (bs *budgetService) CreateBudget(ctx context.Context, budget *model.Budget) error {
	return bs.repo.CreateBudget(ctx, budget)
}

func (bs *budgetService) GetBudgetsByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error) {
	return bs.repo.GetBudgetsByFamilyID(ctx, familyID)
}

func (bs *budgetService) GetBudgetsByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error) {
	return bs.repo.GetBudgetsByUserID(ctx, userID)
}

func (bs *budgetService) GetBudgetByID(ctx context.Context, id uuid.UUID) (*model.Budget, error) {
	return bs.repo.GetBudgetByID(ctx, id)
}

func (bs *budgetService) UpdateBudget(ctx context.Context, budget *model.Budget) error {
	return bs.repo.UpdateBudget(ctx, budget)
}

func (bs *budgetService) DeleteBudget(ctx context.Context, id uuid.UUID) error {
	return bs.repo.DeleteBudget(ctx, id)
}

func (bs *budgetService) GetBudgets(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error) {
	return bs.repo.GetBudgets(ctx, family_id, user_id)
}