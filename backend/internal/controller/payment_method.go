package controller

import (
	"context"

	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type PaymentMethodController interface {
	GetPaymentMethods(ctx context.Context, familyId string) ([]model.PaymentMethod, error)
	CreatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	UpdatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	DeletePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error)
	GetPaymentMethodById(ctx context.Context, id string) (model.PaymentMethod, error)
}

type paymentMethodController struct {
	service service.PaymentMethodService
}

func NewPaymentMethodController(service service.PaymentMethodService) PaymentMethodController {
	return &paymentMethodController{service: service}
}

func (c *paymentMethodController) GetPaymentMethods(ctx context.Context, familyId string) ([]model.PaymentMethod, error) {
	return c.service.GetPaymentMethods(ctx, familyId)
}

func (c *paymentMethodController) CreatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return c.service.CreatePaymentMethod(ctx, paymentMethod)
}

func (c *paymentMethodController) UpdatePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return c.service.UpdatePaymentMethod(ctx, paymentMethod)
}

func (c *paymentMethodController) DeletePaymentMethod(ctx context.Context, paymentMethod model.PaymentMethod) (model.PaymentMethod, error) {
	return c.service.DeletePaymentMethod(ctx, paymentMethod)
}

func (c *paymentMethodController) GetPaymentMethodById(ctx context.Context, id string) (model.PaymentMethod, error) {
	return c.service.GetPaymentMethodById(ctx, id)
}