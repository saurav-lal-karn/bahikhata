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

type GoalService interface {
	Create(ctx context.Context, goal *dto.CreateGoalRequest, userID uuid.UUID) (*dto.GoalResponse, error)
	Update(ctx context.Context, id uuid.UUID, goal *dto.UpdateGoalRequest, userID uuid.UUID) (*dto.GoalResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error)
	GetByID(ctx context.Context, goalID uuid.UUID) (*dto.GoalResponse, error)
	GetByName(ctx context.Context, goalName string) (*dto.GoalResponse, error)
	CreateContribution(ctx context.Context, contribution *model.GoalContribution) error
	ListContributions(ctx context.Context, goalID uuid.UUID) ([]model.GoalContribution, error)
}

type goalService struct {
	goalRepo repository.GoalRepository
}

func NewGoalService(goalRepo repository.GoalRepository) GoalService {
	return &goalService{goalRepo: goalRepo}
}

func (s *goalService) Create(ctx context.Context, goal *dto.CreateGoalRequest, userID uuid.UUID) (*dto.GoalResponse, error) {
	goalModel, err := goal.ToGoal()
	if err != nil {
		return nil, NewValidationError(err.Error())
	}

	goalModel.UserID = &userID
	goalModel, err = s.goalRepo.Create(ctx, goalModel)
	if err != nil {
		return nil, NewInternalError("create goal", err)
	}
	return dto.ToGoalResponse(goalModel), nil
}

func (s *goalService) Update(ctx context.Context, id uuid.UUID, goal *dto.UpdateGoalRequest, userID uuid.UUID) (*dto.GoalResponse, error) {
	// Get goal by id
	_, err := s.goalRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("goal", id)
		}
		return nil, NewInternalError("get goal by id", err)
	}

	goalModel, err := goal.ToModel(id)
	if err != nil {
		return nil, NewValidationError(err.Error())
	}
	goalModel, err = s.goalRepo.Update(ctx, id, goalModel)
	if err != nil {
		return nil, NewInternalError("update goal", err)
	}
	return dto.ToGoalResponse(goalModel), nil
}

func (s *goalService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.goalRepo.Delete(ctx, id)
}

func (s *goalService) GetByID(ctx context.Context, goalID uuid.UUID) (*dto.GoalResponse, error) {
	goalModel, err := s.goalRepo.GetByID(ctx, goalID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("goal", goalID)
		}
		return nil, NewInternalError("get goal by id", err)
	}
	return dto.ToGoalResponse(goalModel), nil
}

func (s *goalService) List(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error) {
	return s.goalRepo.List(ctx, familyID, created_by_id)
}

func (s *goalService) GetByName(ctx context.Context, goalName string) (*dto.GoalResponse, error) {
	goalModel, err := s.goalRepo.GetByName(ctx, goalName)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("goal", goalName)
		}
		return nil, NewInternalError("get goal by name", err)
	}
	return dto.ToGoalResponse(goalModel), nil
}

func (s *goalService) CreateContribution(ctx context.Context, contribution *model.GoalContribution) error {
	return s.goalRepo.CreateContribution(ctx, contribution)
}

func (s *goalService) ListContributions(ctx context.Context, goalID uuid.UUID) ([]model.GoalContribution, error) {
	return s.goalRepo.ListContributions(ctx, goalID)
}