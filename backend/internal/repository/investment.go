package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type InvestmentRepository interface {
	Create(ctx context.Context, investment *model.Investment) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Investment, error)
	Delete(ctx context.Context, id uuid.UUID) error
	CreateTransaction(ctx context.Context, transaction *model.InvestmentTransaction) error
	ListTransactions(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentTransaction, error)
}

type investmentRepository struct {
	db *gorm.DB
}

func NewInvestmentRepository(db *gorm.DB) InvestmentRepository {
	return &investmentRepository{db: db}
}

func (r *investmentRepository) Create(ctx context.Context, investment *model.Investment) error {
	return r.db.WithContext(ctx).Create(investment).Error
}

func (r *investmentRepository) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Investment, error) {
	var investments []model.Investment
	query := r.db.WithContext(ctx)

	if familyID != nil {
		query = query.Where("family_id = ?", familyID)
	}
	if userID != nil {
		query = query.Where("user_id = ?", userID)
	}

	if err := query.Find(&investments).Error; err != nil {
		return nil, err
	}
	return investments, nil
}

func (r *investmentRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Investment{}, id).Error
}

func (r *investmentRepository) CreateTransaction(ctx context.Context, transaction *model.InvestmentTransaction) error {
	return r.db.WithContext(ctx).Create(transaction).Error
}

func (r *investmentRepository) ListTransactions(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentTransaction, error) {
	var transactions []model.InvestmentTransaction
	return transactions, r.db.WithContext(ctx).Preload("Transaction").Where("investment_id = ?", investmentID).Order("transaction_date desc").Find(&transactions).Error
}
