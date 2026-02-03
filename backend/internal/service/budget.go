package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type BudgetService interface {
	Create(ctx context.Context, budget *model.Budget) error
	GetByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error)
	GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Budget, error)
	Update(ctx context.Context, budget *model.Budget) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error)

	GetPeriods(ctx context.Context, budgetID uuid.UUID) ([]model.BudgetPeriod, error)
	GetAlerts(ctx context.Context, familyID *uuid.UUID) ([]model.BudgetAlert, error)
	AcknowledgeAlert(ctx context.Context, alertID uuid.UUID) error
}

type budgetService struct {
	repo repository.BudgetRepository
}

func NewBudgetService(repo repository.BudgetRepository) BudgetService {
	return &budgetService{repo: repo}
}

func (bs *budgetService) Create(ctx context.Context, budget *model.Budget) error {
	return bs.repo.Create(ctx, budget)
}

func (bs *budgetService) GetByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error) {
	return bs.repo.GetByFamilyID(ctx, familyID)
}

func (bs *budgetService) GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error) {
	return bs.repo.GetByUserID(ctx, userID)
}

func (bs *budgetService) GetByID(ctx context.Context, id uuid.UUID) (*model.Budget, error) {
	return bs.repo.GetByID(ctx, id)
}

func (bs *budgetService) Update(ctx context.Context, budget *model.Budget) error {
	return bs.repo.Update(ctx, budget)
}

func (bs *budgetService) Delete(ctx context.Context, id uuid.UUID) error {
	return bs.repo.Delete(ctx, id)
}

func (bs *budgetService) List(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error) {
	return bs.repo.List(ctx, family_id, user_id)
}

func (bs *budgetService) GetPeriods(ctx context.Context, budgetID uuid.UUID) ([]model.BudgetPeriod, error) {
	return bs.repo.GetPeriods(ctx, budgetID)
}

func (bs *budgetService) GetAlerts(ctx context.Context, familyID *uuid.UUID) ([]model.BudgetAlert, error) {
	return bs.repo.GetAlerts(ctx, familyID)
}

func (bs *budgetService) AcknowledgeAlert(ctx context.Context, alertID uuid.UUID) error {
	return bs.repo.AcknowledgeAlert(ctx, alertID)
}