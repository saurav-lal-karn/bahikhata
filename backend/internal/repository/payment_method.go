package repository

import (
	"context"

	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type PaymentMethodRepository interface {
	GetPaymentMethods(ctx context.Context, familyId string) ([]model.PaymentMethod, error)
	CreatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	UpdatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	DeletePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	GetPaymentMethodById(ctx context.Context, id string) (model.PaymentMethod, error)
}

type paymentMethodRepository struct {
	db *gorm.DB
}

func NewPaymentMethodRepository(db *gorm.DB) PaymentMethodRepository {
	return &paymentMethodRepository{db: db}
}

func (r *paymentMethodRepository) GetPaymentMethods(ctx context.Context, familyId string) ([]model.PaymentMethod, error) {
	var paymentMethods []model.PaymentMethod
	if err := r.db.WithContext(ctx).Where("family_id = ?", familyId).Find(&paymentMethods).Error; err != nil {
		return nil, err
	}
	return paymentMethods, nil
}

func (r *paymentMethodRepository) CreatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	if err := r.db.WithContext(ctx).Create(&paymentMethod).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}

func (r *paymentMethodRepository) UpdatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	if err := r.db.WithContext(ctx).Save(&paymentMethod).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}

func (r *paymentMethodRepository) DeletePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	if err := r.db.WithContext(ctx).Delete(&paymentMethod).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}

func (r *paymentMethodRepository) GetPaymentMethodById(ctx context.Context, id string) (model.PaymentMethod, error) {
	var paymentMethod model.PaymentMethod
	if err := r.db.WithContext(ctx).First(&paymentMethod, id).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}