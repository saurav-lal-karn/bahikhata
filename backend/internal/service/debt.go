package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type DebtService interface {
	Create(ctx context.Context, debt *model.Debt) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error)
	Delete(ctx context.Context, id uuid.UUID) error
	CreateRepayment(ctx context.Context, repayment *model.DebtRepayment) error
	ListRepayments(ctx context.Context, debtID uuid.UUID) ([]model.DebtRepayment, error)
	CreateSchedules(ctx context.Context, schedules []model.DebtSchedule) error
	UpdateScheduleStatus(ctx context.Context, id uuid.UUID, status string) error
}

type debtService struct {
	repo repository.DebtRepository
}

func NewDebtService(repo repository.DebtRepository) DebtService {
	return &debtService{repo: repo}
}

func (s *debtService) Create(ctx context.Context, debt *model.Debt) error {
	return s.repo.Create(ctx, debt)
}

func (s *debtService) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error) {
	return s.repo.List(ctx, familyID, userID)
}

func (s *debtService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}

func (s *debtService) CreateRepayment(ctx context.Context, repayment *model.DebtRepayment) error {
	return s.repo.CreateRepayment(ctx, repayment)
}

func (s *debtService) ListRepayments(ctx context.Context, debtID uuid.UUID) ([]model.DebtRepayment, error) {
	return s.repo.ListRepayments(ctx, debtID)
}

func (s *debtService) CreateSchedules(ctx context.Context, schedules []model.DebtSchedule) error {
	return s.repo.CreateSchedules(ctx, schedules)
}

func (s *debtService) UpdateScheduleStatus(ctx context.Context, id uuid.UUID, status string) error {
	return s.repo.UpdateScheduleStatus(ctx, id, status)
}
