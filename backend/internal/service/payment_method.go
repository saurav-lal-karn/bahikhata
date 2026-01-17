package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type PaymentMethodService interface {
	GetPaymentMethods(ctx context.Context, familyId string) ([]model.PaymentMethod, error)
	CreatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	UpdatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	DeletePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	GetPaymentMethodById(ctx context.Context, id uuid.UUID) (model.PaymentMethod, error)
}

type paymentMethodService struct {
	repo repository.PaymentMethodRepository
}

func NewPaymentMethodService(repo repository.PaymentMethodRepository) PaymentMethodService {
	return &paymentMethodService{repo: repo}
}

func (s *paymentMethodService) GetPaymentMethods(ctx context.Context, familyId string) ([]model.PaymentMethod, error) {
	return s.repo.GetPaymentMethods(ctx, familyId)
}

func (s *paymentMethodService) CreatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return s.repo.CreatePaymentMethod(ctx, paymentMethod)
}

func (s *paymentMethodService) UpdatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return s.repo.UpdatePaymentMethod(ctx, paymentMethod)
}

func (s *paymentMethodService) DeletePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return s.repo.DeletePaymentMethod(ctx, paymentMethod)
}

func (s *paymentMethodService) GetPaymentMethodById(ctx context.Context, id uuid.UUID) (model.PaymentMethod, error) {
	return s.repo.GetPaymentMethodById(ctx, id)
}