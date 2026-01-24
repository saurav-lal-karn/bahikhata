package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type ExpenseRepository interface {
    Create(ctx context.Context, expense *model.Expense) (*model.Expense, error)
    GetByID(ctx context.Context, id uuid.UUID) (*model.Expense, error)
    List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Expense, error)
    Update(ctx context.Context, id uuid.UUID, expense *model.Expense) (*model.Expense, error)
    Delete(ctx context.Context, id uuid.UUID) error
    GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (int, float64, float64, float64, error)
}

type expenseRepository struct {
    db *gorm.DB
}

func NewExpenseRepository(db *gorm.DB) ExpenseRepository {
    return &expenseRepository{db: db}
}

func (r *expenseRepository) Create(ctx context.Context, expense *model.Expense) (*model.Expense, error) {
    if err := r.db.WithContext(ctx).Create(expense).Error; err != nil {
        return nil, fmt.Errorf("expense repository: failed to create expense %s: %w", expense.ID, err)
    }
    return expense, nil
}

func (r *expenseRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Expense, error) {
    var expense model.Expense
    if err := r.db.WithContext(ctx).Preload("Category").Preload("PaymentMethod").First(&expense, id).Error; err != nil {
        return nil, fmt.Errorf("expense repository: failed to get expense %s: %w", id, err)
    }
    return &expense, nil
}

func (r *expenseRepository) List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Expense, error) {
    var expenses []model.Expense
    if err := r.db.WithContext(ctx).
        Where("family_id = ? AND created_by_id = ?", familyID, userId).
        Preload("Category").
        Preload("PaymentMethod").
        Find(&expenses).Error; err != nil {
        return nil, fmt.Errorf("expense repository: failed to list expenses: %w", err)
    }
    
    return expenses, nil
}

func (r *expenseRepository) Update(ctx context.Context,id uuid.UUID, expense *model.Expense) (*model.Expense, error) {
	result := r.db.WithContext(ctx).Model(&model.Expense{}).Where("id = ?", id).Updates(expense)
	if result.Error != nil {
		return nil, fmt.Errorf("expense repository: failed to update expense %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	
	// Fetch and return the updated expense
	return r.GetByID(ctx, id)
}

func (r *expenseRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&model.Expense{}, id)
	if result.Error != nil {
		return fmt.Errorf("expense repository: failed to delete expense %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *expenseRepository) GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (int, float64, float64, float64, error) {
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