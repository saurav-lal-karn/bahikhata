package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type SubscriptionRepository interface {
	CreateSubscription(ctx context.Context, sub *model.Subscription) error
	GetSubscriptions(ctx context.Context, familyID uuid.UUID) ([]model.Subscription, error)
	GetSubscriptionByID(ctx context.Context, id uuid.UUID) (*model.Subscription, error)
	UpdateSubscription(ctx context.Context, sub *model.Subscription) error
	DeleteSubscription(ctx context.Context, id uuid.UUID) error

	CreatePayment(ctx context.Context, payment *model.SubscriptionPayment) error
	GetPaymentsBySubscription(ctx context.Context, subID uuid.UUID) ([]model.SubscriptionPayment, error)
}

type subscriptionRepository struct {
	db *gorm.DB
}

func NewSubscriptionRepository(db *gorm.DB) SubscriptionRepository {
	return &subscriptionRepository{db: db}
}

func (r *subscriptionRepository) CreateSubscription(ctx context.Context, sub *model.Subscription) error {
	return r.db.WithContext(ctx).Create(sub).Error
}

func (r *subscriptionRepository) GetSubscriptions(ctx context.Context, familyID uuid.UUID) ([]model.Subscription, error) {
	var subs []model.Subscription
	err := r.db.WithContext(ctx).Where("family_id = ?", familyID).Preload("Category").Preload("Wallet").Find(&subs).Error
	return subs, err
}

func (r *subscriptionRepository) GetSubscriptionByID(ctx context.Context, id uuid.UUID) (*model.Subscription, error) {
	var sub model.Subscription
	err := r.db.WithContext(ctx).Preload("Category").Preload("Wallet").Preload("Payments.Transaction").First(&sub, id).Error
	return &sub, err
}

func (r *subscriptionRepository) UpdateSubscription(ctx context.Context, sub *model.Subscription) error {
	return r.db.WithContext(ctx).Save(sub).Error
}

func (r *subscriptionRepository) DeleteSubscription(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Subscription{}, id).Error
}

func (r *subscriptionRepository) CreatePayment(ctx context.Context, payment *model.SubscriptionPayment) error {
	return r.db.WithContext(ctx).Create(payment).Error
}

func (r *subscriptionRepository) GetPaymentsBySubscription(ctx context.Context, subID uuid.UUID) ([]model.SubscriptionPayment, error) {
	var payments []model.SubscriptionPayment
	err := r.db.WithContext(ctx).Where("subscription_id = ?", subID).Preload("Transaction").Order("created_at desc").Find(&payments).Error
	return payments, err
}
