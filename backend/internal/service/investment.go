package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type InvestmentService interface {
	Create(ctx context.Context, investment *model.Investment) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Investment, error)
	Delete(ctx context.Context, id uuid.UUID) error
	CreateTransaction(ctx context.Context, transaction *model.InvestmentTransaction) error
	ListTransactions(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentTransaction, error)
	CreateValuation(ctx context.Context, valuation *model.InvestmentValuation) error
}

type investmentService struct {
	repo repository.InvestmentRepository
}

func NewInvestmentService(repo repository.InvestmentRepository) InvestmentService {
	return &investmentService{repo: repo}
}

func (s *investmentService) Create(ctx context.Context, investment *model.Investment) error {
	return s.repo.Create(ctx, investment)
}

func (s *investmentService) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Investment, error) {
	return s.repo.List(ctx, familyID, userID)
}

func (s *investmentService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}

func (s *investmentService) CreateTransaction(ctx context.Context, transaction *model.InvestmentTransaction) error {
	return s.repo.CreateTransaction(ctx, transaction)
}

func (s *investmentService) ListTransactions(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentTransaction, error) {
	return s.repo.ListTransactions(ctx, investmentID)
}

func (s *investmentService) CreateValuation(ctx context.Context, valuation *model.InvestmentValuation) error {
	return s.repo.CreateValuation(ctx, valuation)
}
