package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type PaymentMethodRepository interface {
	List(ctx context.Context, familyId string) ([]model.PaymentMethod, error)
	Create(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	Update(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	Delete(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	GetByID(ctx context.Context, id uuid.UUID) (model.PaymentMethod, error)
	GetByName(ctx context.Context, name string, familyId uuid.UUID) (model.PaymentMethod, error)
}

type paymentMethodRepository struct {
	db *gorm.DB
}

func NewPaymentMethodRepository(db *gorm.DB) PaymentMethodRepository {
	return &paymentMethodRepository{db: db}
}

func (r *paymentMethodRepository) List(ctx context.Context, familyId string) ([]model.PaymentMethod, error) {
	var paymentMethods []model.PaymentMethod
	if err := r.db.WithContext(ctx).Where("family_id = ? OR is_system = ?", familyId, true).Find(&paymentMethods).Error; err != nil {
		return nil, err
	}
	return paymentMethods, nil
}

func (r *paymentMethodRepository) Create(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	if err := r.db.WithContext(ctx).Create(&paymentMethod).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}

func (r *paymentMethodRepository) Update(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	if err := r.db.WithContext(ctx).Save(&paymentMethod).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}

func (r *paymentMethodRepository) Delete(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	if err := r.db.WithContext(ctx).Delete(&paymentMethod).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}

func (r *paymentMethodRepository) GetByID(ctx context.Context, id uuid.UUID) (model.PaymentMethod, error) {
	var paymentMethod model.PaymentMethod
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&paymentMethod).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}

func (r *paymentMethodRepository) GetByName(ctx context.Context, name string, familyId uuid.UUID) (model.PaymentMethod, error) {
	var paymentMethod model.PaymentMethod
	if err := r.db.WithContext(ctx).Where("name = ? AND family_id = ?", name, familyId).First(&paymentMethod).Error; err != nil {
		return model.PaymentMethod{}, err
	}
	return paymentMethod, nil
}