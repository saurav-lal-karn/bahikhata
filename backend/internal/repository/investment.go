package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type InvestmentRepository interface {
	Create(ctx context.Context, investment *model.Investment) (*model.Investment, error)
	Update(ctx context.Context, id uuid.UUID, investment *model.Investment) (*model.Investment, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Investment, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Investment, error)
	CreateTransaction(ctx context.Context, transaction *model.InvestmentTransaction) (*model.InvestmentTransaction, error)
	ListTransactions(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentTransaction, error)
	CreateValuation(ctx context.Context, valuation *model.InvestmentValuation) (*model.InvestmentValuation, error)
	ListValuations(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentValuation, error)
}

type investmentRepository struct {
	db *gorm.DB
}

func NewInvestmentRepository(db *gorm.DB) InvestmentRepository {
	return &investmentRepository{db: db}
}

func (r *investmentRepository) Create(ctx context.Context, investment *model.Investment) (*model.Investment, error) {
	if err := r.db.WithContext(ctx).Create(investment).Error; err != nil {
		return nil, err
	}
	return investment, nil
}

func (r *investmentRepository) Update(ctx context.Context, id uuid.UUID, investment *model.Investment) (*model.Investment, error) {
	result := r.db.WithContext(ctx).Model(&model.Investment{}).Where("id = ?", id).Updates(investment)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update investment %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return r.GetByID(ctx, id)
}

func (r *investmentRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Investment, error) {
	var investment model.Investment
	if err := r.db.WithContext(ctx).First(&investment, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &investment, nil
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
	return r.db.WithContext(ctx).Delete(&model.Investment{}, "id = ?", id).Error
}

func (r *investmentRepository) CreateTransaction(ctx context.Context, transaction *model.InvestmentTransaction) (*model.InvestmentTransaction, error) {
	if err := r.db.WithContext(ctx).Create(transaction).Error; err != nil {
		return nil, err
	}
	return transaction, nil
}

func (r *investmentRepository) ListTransactions(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentTransaction, error) {
	var transactions []model.InvestmentTransaction
	return transactions, r.db.WithContext(ctx).Preload("Transaction").Where("investment_id = ?", investmentID).Order("transaction_date desc").Find(&transactions).Error
}

func (r *investmentRepository) CreateValuation(ctx context.Context, valuation *model.InvestmentValuation) (*model.InvestmentValuation, error) {
	if err := r.db.WithContext(ctx).Create(valuation).Error; err != nil {
		return nil, err
	}
	return valuation, nil
}

func (r *investmentRepository) ListValuations(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentValuation, error) {
	var valuations []model.InvestmentValuation
	err := r.db.WithContext(ctx).Where("investment_id = ?", investmentID).
		Order("valuation_date desc, created_at desc").
		Find(&valuations).Error
	return valuations, err
}
