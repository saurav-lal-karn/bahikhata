package repository

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type SubscriptionRepository interface {
	CreateSubscription(sub *model.Subscription) error
	GetSubscriptions(familyID uuid.UUID) ([]model.Subscription, error)
	GetSubscriptionByID(id uuid.UUID) (*model.Subscription, error)
	UpdateSubscription(sub *model.Subscription) error
	DeleteSubscription(id uuid.UUID) error

	CreatePayment(payment *model.SubscriptionPayment) error
	GetPaymentsBySubscription(subID uuid.UUID) ([]model.SubscriptionPayment, error)
}

type subscriptionRepository struct {
	db *gorm.DB
}

func NewSubscriptionRepository(db *gorm.DB) SubscriptionRepository {
	return &subscriptionRepository{db: db}
}

func (r *subscriptionRepository) CreateSubscription(sub *model.Subscription) error {
	return r.db.Create(sub).Error
}

func (r *subscriptionRepository) GetSubscriptions(familyID uuid.UUID) ([]model.Subscription, error) {
	var subs []model.Subscription
	err := r.db.Where("family_id = ?", familyID).Preload("Category").Preload("Wallet").Find(&subs).Error
	return subs, err
}

func (r *subscriptionRepository) GetSubscriptionByID(id uuid.UUID) (*model.Subscription, error) {
	var sub model.Subscription
	err := r.db.Preload("Category").Preload("Wallet").Preload("Payments.Transaction").First(&sub, id).Error
	return &sub, err
}

func (r *subscriptionRepository) UpdateSubscription(sub *model.Subscription) error {
	return r.db.Save(sub).Error
}

func (r *subscriptionRepository) DeleteSubscription(id uuid.UUID) error {
	return r.db.Delete(&model.Subscription{}, id).Error
}

func (r *subscriptionRepository) CreatePayment(payment *model.SubscriptionPayment) error {
	return r.db.Create(payment).Error
}

func (r *subscriptionRepository) GetPaymentsBySubscription(subID uuid.UUID) ([]model.SubscriptionPayment, error) {
	var payments []model.SubscriptionPayment
	err := r.db.Where("subscription_id = ?", subID).Preload("Transaction").Order("created_at desc").Find(&payments).Error
	return payments, err
}
