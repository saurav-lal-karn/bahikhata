package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type PaymentMethodService interface {
	List(ctx context.Context, familyId string) ([]model.PaymentMethod, error)
	Create(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	Update(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	Delete(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	GetByID(ctx context.Context, id uuid.UUID) (model.PaymentMethod, error)
}

type paymentMethodService struct {
	repo repository.PaymentMethodRepository
}

func NewPaymentMethodService(repo repository.PaymentMethodRepository) PaymentMethodService {
	return &paymentMethodService{repo: repo}
}

func (s *paymentMethodService) List(ctx context.Context, familyId string) ([]model.PaymentMethod, error) {
	return s.repo.List(ctx, familyId)
}

func (s *paymentMethodService) Create(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return s.repo.Create(ctx, paymentMethod)
}

func (s *paymentMethodService) Update(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return s.repo.Update(ctx, paymentMethod)
}

func (s *paymentMethodService) Delete(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return s.repo.Delete(ctx, paymentMethod)
}

func (s *paymentMethodService) GetByID(ctx context.Context, id uuid.UUID) (model.PaymentMethod, error) {
	return s.repo.GetByID(ctx, id)
}