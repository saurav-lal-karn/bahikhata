package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type RecurringTransactionService interface {
	Create(ctx context.Context, rt *model.RecurringTransaction) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.RecurringTransaction, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type recurringTransactionService struct {
	repo repository.RecurringTransactionRepository
}

func NewRecurringTransactionService(repo repository.RecurringTransactionRepository) RecurringTransactionService {
	return &recurringTransactionService{repo: repo}
}

func (s *recurringTransactionService) Create(ctx context.Context, rt *model.RecurringTransaction) error {
	return s.repo.Create(ctx, rt)
}

func (s *recurringTransactionService) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.RecurringTransaction, error) {
	return s.repo.List(ctx, familyID, userID)
}

func (s *recurringTransactionService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
