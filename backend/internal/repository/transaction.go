package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

// TransactionRepository defines the operations for unified transaction data access.
type TransactionRepository interface {
	Create(ctx context.Context, tx *model.Transaction) (*model.Transaction, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Transaction, error)
	List(ctx context.Context, familyID uuid.UUID, userID *uuid.UUID, filters map[string]interface{}) ([]model.Transaction, int64, error)
	Update(ctx context.Context, id uuid.UUID, tx *model.Transaction) (*model.Transaction, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetStats(ctx context.Context, familyID uuid.UUID, userID *uuid.UUID, filters map[string]interface{}) (map[string]interface{}, error)
}

type transactionRepository struct {
	db *gorm.DB
}

// NewTransactionRepository creates a new instance of transactionRepository.
func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	return &transactionRepository{db: db}
}

func (r *transactionRepository) Create(ctx context.Context, tx *model.Transaction) (*model.Transaction, error) {
	if err := r.db.WithContext(ctx).Create(tx).Error; err != nil {
		return nil, fmt.Errorf("failed to create transaction: %w", err)
	}
	return tx, nil
}

func (r *transactionRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Transaction, error) {
	var tx model.Transaction
	if err := r.db.WithContext(ctx).
		Preload("Wallet").
		Preload("Category").
		Preload("PaymentMethod").
		Preload("User").
		Preload("Contact").
		Preload("Location").
		Preload("Project").
		First(&tx, id).Error; err != nil {
		return nil, fmt.Errorf("failed to get transaction %s: %w", id, err)
	}
	return &tx, nil
}

func (r *transactionRepository) List(ctx context.Context, familyID uuid.UUID, userID *uuid.UUID, filters map[string]interface{}) ([]model.Transaction, int64, error) {
	var txs []model.Transaction
	var total int64

	query := r.db.WithContext(ctx).Where("family_id = ?", familyID)

	if userID != nil {
		query = query.Where("user_id = ? OR created_by_id = ?", *userID, *userID)
	}

	// Apply basic filters
	if type_, ok := filters["type"]; ok {
		query = query.Where("type = ?", type_)
	}
	if walletID, ok := filters["wallet_id"]; ok {
		query = query.Where("wallet_id = ?", walletID)
	}
	if categoryID, ok := filters["category_id"]; ok {
		query = query.Where("category_id = ?", categoryID)
	}
	if projectID, ok := filters["project_id"]; ok {
		query = query.Where("project_id = ?", projectID)
	}
	if contactID, ok := filters["contact_id"]; ok {
		query = query.Where("contact_id = ?", contactID)
	}

	// Count total records
	if err := query.Model(&model.Transaction{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count transactions: %w", err)
	}

	// Apply pagination
	page := 1
	pageSize := 10
	if p, ok := filters["page"].(int); ok && p > 0 {
		page = p
	}
	if ps, ok := filters["page_size"].(int); ok && ps > 0 {
		pageSize = ps
	}
	offset := (page - 1) * pageSize

	if err := query.
		Preload("Wallet").
		Preload("Category").
		Preload("PaymentMethod").
		Preload("Contact").
		Preload("Location").
		Preload("Project").
		Order("transaction_date DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&txs).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to list transactions: %w", err)
	}

	return txs, total, nil
}

func (r *transactionRepository) Update(ctx context.Context, id uuid.UUID, tx *model.Transaction) (*model.Transaction, error) {
	result := r.db.WithContext(ctx).Model(&model.Transaction{}).Where("id = ?", id).Updates(tx)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update transaction %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return r.GetByID(ctx, id)
}

func (r *transactionRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&model.Transaction{}, id)
	if result.Error != nil {
		return fmt.Errorf("failed to delete transaction %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *transactionRepository) GetStats(ctx context.Context, familyID uuid.UUID, userID *uuid.UUID, filters map[string]interface{}) (map[string]interface{}, error) {
	var result struct {
		TotalCount    int64   `gorm:"column:total_count"`
		TotalAmount   float64 `gorm:"column:total_amount"`
		ThisMonth     float64 `gorm:"column:this_month"`
		LastMonth     float64 `gorm:"column:last_month"`
		AverageAmount float64 `gorm:"column:average_amount"`
	}

	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	startOfLastMonth := startOfMonth.AddDate(0, -1, 0)
	endOfLastMonth := startOfMonth.Add(-time.Nanosecond)

	query := r.db.WithContext(ctx).Table("transactions").
		Select(`
			COUNT(*) as total_count,
			COALESCE(SUM(amount), 0) as total_amount,
			COALESCE(SUM(CASE WHEN transaction_date >= ? THEN amount ELSE 0 END), 0) as this_month,
			COALESCE(SUM(CASE WHEN transaction_date >= ? AND transaction_date <= ? THEN amount ELSE 0 END), 0) as last_month,
			COALESCE(AVG(amount), 0) as average_amount
		`, startOfMonth, startOfLastMonth, endOfLastMonth).
		Where("family_id = ? AND deleted_at IS NULL", familyID)

	if userID != nil {
		query = query.Where("user_id = ? OR created_by_id = ?", *userID, *userID)
	}

	if type_, ok := filters["type"]; ok && type_ != "" {
		query = query.Where("type = ?", type_)
	}

	if err := query.Scan(&result).Error; err != nil {
		return nil, fmt.Errorf("failed to get transaction stats: %w", err)
	}

	return map[string]interface{}{
		"total_count":    result.TotalCount,
		"total_amount":   result.TotalAmount,
		"this_month":     result.ThisMonth,
		"last_month":     result.LastMonth,
		"average_amount": result.AverageAmount,
	}, nil
}
