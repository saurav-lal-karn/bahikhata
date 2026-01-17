package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type ExpenseRepository interface {
    CreateExpense(ctx context.Context, expense *model.Expense) error
    GetExpenseById(ctx context.Context, id uuid.UUID) (*model.Expense, error)
    ListExpenses(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Expense, error)
    UpdateExpense(ctx context.Context, expense *model.Expense) error
    DeleteExpense(ctx context.Context, id uuid.UUID) error
    GetExpenseStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (int, float64, float64, float64, error)
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

func (r *expenseRepository) ListExpenses(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Expense, error) {
    var expenses []model.Expense
    if err := r.db.WithContext(ctx).
        Where("family_id = ? AND created_by_id = ?", familyID, userId).
        Preload("Category").
        Preload("PaymentMethod").
        Find(&expenses).Error; err != nil {
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

func (r *expenseRepository) GetExpenseStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (int, float64, float64, float64, error) {
    var totalCount int64
    var totalAmount float64
    var thisMonthAmount float64
    var lastMonthAmount float64

    // Get total count
    if err := r.db.WithContext(ctx).
        Model(&model.Expense{}).
        Where("family_id = ? AND created_by_id = ?", familyID, userId).
        Count(&totalCount).Error; err != nil {
        return 0, 0, 0, 0, err
    }

    // Get total amount
    if err := r.db.WithContext(ctx).
        Model(&model.Expense{}).
        Where("family_id = ? AND created_by_id = ?", familyID, userId).
        Select("COALESCE(SUM(amount), 0)").
        Scan(&totalAmount).Error; err != nil {
        return 0, 0, 0, 0, err
    }

    // Get this month's total
    now := time.Now()
    startOfThisMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
    if err := r.db.WithContext(ctx).
        Model(&model.Expense{}).
        Where("family_id = ? AND created_by_id = ? AND transaction_date >= ?", familyID, userId, startOfThisMonth).
        Select("COALESCE(SUM(amount), 0)").
        Scan(&thisMonthAmount).Error; err != nil {
        return 0, 0, 0, 0, err
    }

    // Get last month's total
    startOfLastMonth := startOfThisMonth.AddDate(0, -1, 0)
    endOfLastMonth := startOfThisMonth.AddDate(0, 0, -1)
    if err := r.db.WithContext(ctx).
        Model(&model.Expense{}).
        Where("family_id = ? AND created_by_id = ? AND transaction_date >= ? AND transaction_date <= ?", familyID, userId, startOfLastMonth, endOfLastMonth).
        Select("COALESCE(SUM(amount), 0)").
        Scan(&lastMonthAmount).Error; err != nil {
        return 0, 0, 0, 0, err
    }

    return int(totalCount), totalAmount, thisMonthAmount, lastMonthAmount, nil
}