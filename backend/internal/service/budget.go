package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
)

type BudgetService interface {
	Create(ctx context.Context, budget *dto.CreateBudgetRequest, userID uuid.UUID) (*dto.BudgetResponse, error)
	Update(ctx context.Context, id uuid.UUID, budget *dto.UpdateBudgetRequest, userID uuid.UUID) (*dto.BudgetResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error)
	GetByID(ctx context.Context, id uuid.UUID) (*dto.BudgetResponse, error)
	GetByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error)
	GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error)

	GetPeriods(ctx context.Context, budgetID uuid.UUID) ([]model.BudgetPeriod, error)
	GetAlerts(ctx context.Context, familyID *uuid.UUID) ([]model.BudgetAlert, error)
	AcknowledgeAlert(ctx context.Context, alertID uuid.UUID) error
}

type budgetService struct {
	budgetRepo repository.BudgetRepository
}

func NewBudgetService(budgetRepo repository.BudgetRepository) BudgetService {
	return &budgetService{budgetRepo: budgetRepo}
}

func (bs *budgetService) Create(ctx context.Context, budget *dto.CreateBudgetRequest, userID uuid.UUID) (*dto.BudgetResponse, error) {
	budgetModel := budget.ToModel()
	budgetModel.UserID = userID
	budgetModel, err := bs.budgetRepo.Create(ctx, budgetModel)
	if err != nil {
		return nil, NewInternalError("create budget", err)
	}
	return dto.ToBudgetResponse(budgetModel), nil
}

func (bs *budgetService) Update(ctx context.Context, id uuid.UUID, budget *dto.UpdateBudgetRequest, userID uuid.UUID) (*dto.BudgetResponse, error) {
	// Get budget by id, check if it exists
	_, err := bs.budgetRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("budget", id)
		}
		return nil, NewInternalError("get budget by id", err)
	}

	budgetModel := budget.ToModel(id)
	budgetModel.UserID = userID
	budgetModel, err = bs.budgetRepo.Update(ctx, id, budgetModel)
	if err != nil {
		return nil, NewInternalError("update budget", err)
	}
	return dto.ToBudgetResponse(budgetModel), nil
}

func (bs *budgetService) Delete(ctx context.Context, id uuid.UUID) error {
	return bs.budgetRepo.Delete(ctx, id)
}

func (bs *budgetService) List(ctx context.Context, family_id *uuid.UUID, user_id *uuid.UUID) ([]model.Budget, error) {
	return bs.budgetRepo.List(ctx, family_id, user_id)
}

func (bs *budgetService) GetByID(ctx context.Context, id uuid.UUID) (*dto.BudgetResponse, error) {
	budgetModel, err := bs.budgetRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("budget", id)
		}
		return nil, NewInternalError("get budget by id", err)
	}
	return dto.ToBudgetResponse(budgetModel), nil
}

func (bs *budgetService) GetByFamilyID(ctx context.Context, familyID uuid.UUID) ([]model.Budget, error) {
	return bs.budgetRepo.GetByFamilyID(ctx, familyID)
}

func (bs *budgetService) GetByUserID(ctx context.Context, userID uuid.UUID) ([]model.Budget, error) {
	return bs.budgetRepo.GetByUserID(ctx, userID)
}

func (bs *budgetService) GetPeriods(ctx context.Context, budgetID uuid.UUID) ([]model.BudgetPeriod, error) {
	return bs.budgetRepo.GetPeriods(ctx, budgetID)
}

func (bs *budgetService) GetAlerts(ctx context.Context, familyID *uuid.UUID) ([]model.BudgetAlert, error) {
	return bs.budgetRepo.GetAlerts(ctx, familyID)
}

func (bs *budgetService) AcknowledgeAlert(ctx context.Context, alertID uuid.UUID) error {
	return bs.budgetRepo.AcknowledgeAlert(ctx, alertID)
}