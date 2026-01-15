package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type ExpenseRepository interface {
    CreateExpense(ctx context.Context, expense *model.Expense) error
    GetExpenseById(ctx context.Context, id uuid.UUID) (*model.Expense, error)
    ListExpenses(ctx context.Context) ([]model.Expense, error)
    UpdateExpense(ctx context.Context, expense *model.Expense) error
    DeleteExpense(ctx context.Context, id uuid.UUID) error
}

type expenseRepository struct {
    db *gorm.DB
}

func NewExpenseRepository(db *gorm.DB) ExpenseRepository {
    return &expenseRepository{db: db}
}

func (r *expenseRepository) CreateExpense(ctx context.Context, expense *model.Expense) error {
    return r.db.Create(expense).Error
}

func (r *expenseRepository) GetExpenseById(ctx context.Context, id uuid.UUID) (*model.Expense, error) {
    var expense model.Expense
    if err := r.db.First(&expense, id).Error; err != nil {
        return nil, err
    }
    return &expense, nil
}

func (r *expenseRepository) ListExpenses(ctx context.Context) ([]model.Expense, error) {
    var expenses []model.Expense
    if err := r.db.Find(&expenses).Error; err != nil {
        return nil, err
    }
    return expenses, nil
}

func (r *expenseRepository) UpdateExpense(ctx context.Context, expense *model.Expense) error {
    return r.db.Save(expense).Error
}

func (r *expenseRepository) DeleteExpense(ctx context.Context, id uuid.UUID) error {
    return r.db.Delete(&model.Expense{}, id).Error
}