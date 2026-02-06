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

type DebtService interface {
	Create(ctx context.Context, debt *dto.CreateDebtRequest, userID uuid.UUID) (*dto.DebtResponse, error)
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error)
	Delete(ctx context.Context, id uuid.UUID) error
	Update(ctx context.Context, id uuid.UUID, debt *dto.UpdateDebtRequest, userID uuid.UUID) (*dto.DebtResponse, error)
	GetByID(ctx context.Context, id uuid.UUID) (*dto.DebtResponse, error)

	CreateRepayment(ctx context.Context, debtID uuid.UUID, repayment *dto.CreateDebtRepaymentRequest) (*dto.DebtRepaymentResponse, error)
	ListRepayments(ctx context.Context, debtID uuid.UUID) ([]model.DebtRepayment, error)
	
	CreateSchedules(ctx context.Context, debtID uuid.UUID, schedules []*dto.CreateDebtScheduleRequest) ([]*dto.DebtScheduleResponse, error)
	UpdateScheduleStatus(ctx context.Context, id uuid.UUID, status string) (*dto.DebtScheduleResponse, error)
	GetAmortizationSchedule(ctx context.Context, debtID uuid.UUID) ([]*dto.DebtScheduleResponse, error)
}

type debtService struct {
	debtRepo repository.DebtRepository
}

func NewDebtService(debtRepo repository.DebtRepository) DebtService {
	return &debtService{debtRepo: debtRepo}
}

func (s *debtService) Create(ctx context.Context, debt *dto.CreateDebtRequest, userID uuid.UUID) (*dto.DebtResponse, error) {
	debtModel, err := debt.ToModel()
	if err != nil {
		return nil, NewValidationError(err.Error())
	}
	debtModel.UserID = userID
	debtModel, err = s.debtRepo.Create(ctx, debtModel)
	if err != nil {
		return nil, NewInternalError("create debt", err)
	}
	return dto.ToDebtResponse(debtModel), nil
}

func (s *debtService) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error) {
	return s.debtRepo.List(ctx, familyID, userID)
}

func (s *debtService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.debtRepo.Delete(ctx, id)
}

func (s *debtService) Update(ctx context.Context, id uuid.UUID, debt *dto.UpdateDebtRequest, userID uuid.UUID) (*dto.DebtResponse, error) {
	_, err := s.debtRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("debt", id)
		}
		return nil, NewInternalError("get debt by id", err)
	}

	debtModel, err := debt.ToModel(id)
	if err != nil {
		return nil, NewValidationError(err.Error())
	}
	debtModel.UserID = userID

	debtModel, err = s.debtRepo.Update(ctx, id, debtModel)
	if err != nil {
		return nil, NewInternalError("update debt", err)
	}
	return dto.ToDebtResponse(debtModel), nil
}

func (s *debtService) GetByID(ctx context.Context, id uuid.UUID) (*dto.DebtResponse, error) {
	debtModel, err := s.debtRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("debt", id)
		}
		return nil, NewInternalError("get debt by id", err)
	}
	return dto.ToDebtResponse(debtModel), nil
}

func (s *debtService) CreateRepayment(ctx context.Context, debtID uuid.UUID, repayment *dto.CreateDebtRepaymentRequest) (*dto.DebtRepaymentResponse, error) {
	repaymentModel := repayment.ToModel(debtID)
	repaymentModel, err := s.debtRepo.CreateRepayment(ctx, repaymentModel)
	if err != nil {
		return nil, NewInternalError("create repayment", err)
	}
	return dto.ToDebtRepaymentResponse(repaymentModel), nil
}

func (s *debtService) ListRepayments(ctx context.Context, debtID uuid.UUID) ([]model.DebtRepayment, error) {
	return s.debtRepo.ListRepayments(ctx, debtID)
}

func (s *debtService) CreateSchedules(ctx context.Context, debtID uuid.UUID, schedules []*dto.CreateDebtScheduleRequest) ([]*dto.DebtScheduleResponse, error) {
	// Convert the schedules to models
	models := make([]*model.DebtSchedule, 0, len(schedules))
	for _, schedule := range schedules {
		models = append(models, schedule.ToModel(debtID))
	}	

	// Create the schedules
	createdSchedulesModels, err := s.debtRepo.CreateSchedules(ctx, models) 
	if err != nil {
		return nil, NewInternalError("create schedules", err)
	}

	// Convert the models to responses
	createdSchedules := make([]*dto.DebtScheduleResponse, 0, len(schedules))
	for _, schedule := range createdSchedulesModels {
		createdSchedules = append(createdSchedules, dto.ToDebtScheduleResponse(schedule))
	}
	return createdSchedules, nil
}

func (s *debtService) UpdateScheduleStatus(ctx context.Context, id uuid.UUID, status string) (*dto.DebtScheduleResponse, error) {
	_, err := s.debtRepo.GetScheduleByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("schedule", id)
		}
		return nil, NewInternalError("get schedule by id", err)
	}

	updatedSchedule, err := s.debtRepo.UpdateScheduleStatus(ctx, id, status)
	if err != nil {
		return nil, NewInternalError("update schedule status", err)
	}
	return dto.ToDebtScheduleResponse(updatedSchedule), nil
}

func (s *debtService) GetAmortizationSchedule(ctx context.Context, debtID uuid.UUID) ([]*dto.DebtScheduleResponse, error) {
	schedules , err := s.debtRepo.GetAmortizationSchedule(ctx, debtID)
	if err != nil {
		return nil, NewInternalError("get amortization schedule", err)
	}

	// Convert the models to responses
	schedulesResponse := make([]*dto.DebtScheduleResponse, 0, len(schedules))
	for _, schedule := range schedules {
		schedulesResponse = append(schedulesResponse, dto.ToDebtScheduleResponse(schedule))
	}
	return schedulesResponse, nil
}
