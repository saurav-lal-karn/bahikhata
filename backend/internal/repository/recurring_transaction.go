package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type RecurringTransactionRepository interface {
	Create(ctx context.Context, rt *model.RecurringTransaction) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.RecurringTransaction, error)
	Delete(ctx context.Context, id uuid.UUID) error
	CreateInstance(ctx context.Context, instance *model.RecurringInstance) error
	ListInstances(ctx context.Context, recurringID uuid.UUID) ([]model.RecurringInstance, error)
}

type recurringTransactionRepository struct {
	db *gorm.DB
}

func NewRecurringTransactionRepository(db *gorm.DB) RecurringTransactionRepository {
	return &recurringTransactionRepository{db: db}
}

func (r *recurringTransactionRepository) Create(ctx context.Context, rt *model.RecurringTransaction) error {
	return r.db.WithContext(ctx).Create(rt).Error
}

func (r *recurringTransactionRepository) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.RecurringTransaction, error) {
	var rts []model.RecurringTransaction
	query := r.db.WithContext(ctx)

	if familyID != nil {
		query = query.Where("family_id = ?", familyID)
	}
	if userID != nil {
		query = query.Where("user_id = ?", userID)
	}

	if err := query.Find(&rts).Error; err != nil {
		return nil, err
	}
	return rts, nil
}

func (r *recurringTransactionRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.RecurringTransaction{}, id).Error
}

func (r *recurringTransactionRepository) CreateInstance(ctx context.Context, instance *model.RecurringInstance) error {
	return r.db.WithContext(ctx).Create(instance).Error
}

func (r *recurringTransactionRepository) ListInstances(ctx context.Context, recurringID uuid.UUID) ([]model.RecurringInstance, error) {
	var instances []model.RecurringInstance
	return instances, r.db.WithContext(ctx).Preload("Transaction").Where("recurring_id = ?", recurringID).Order("execution_date desc").Find(&instances).Error
}
