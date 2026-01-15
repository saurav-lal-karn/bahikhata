package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type ExpenseService interface {
	CreateExpense(ctx context.Context, expense *model.Expense) error
	GetExpenseById(ctx context.Context, id uuid.UUID) (*model.Expense, error)
	ListExpenses(ctx context.Context) ([]model.Expense, error)
	UpdateExpense(ctx context.Context, expense *model.Expense) error
	DeleteExpense(ctx context.Context, id uuid.UUID) error
}

type expenseService struct {
	repo repository.ExpenseRepository
}

func NewExpenseService(repo repository.ExpenseRepository) ExpenseService {
	return &expenseService{repo: repo}
}

func (s *expenseService) CreateExpense(ctx context.Context, expense *model.Expense) error {
	return s.repo.CreateExpense(ctx, expense)
}

func (s *expenseService) GetExpenseById(ctx context.Context, id uuid.UUID) (*model.Expense, error) {
	return s.repo.GetExpenseById(ctx, id)
}

func (s *expenseService) ListExpenses(ctx context.Context) ([]model.Expense, error) {
	return s.repo.ListExpenses(ctx)
}

func (s *expenseService) UpdateExpense(ctx context.Context, expense *model.Expense) error {
	return s.repo.UpdateExpense(ctx, expense)
}

func (s *expenseService) DeleteExpense(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteExpense(ctx, id)
}