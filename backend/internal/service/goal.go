package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type GoalService interface {
	Create(ctx context.Context, goal *model.Goal) error
	Update(ctx context.Context, goal model.Goal) error
	Delete(ctx context.Context, goal model.Goal) error
	Get(ctx context.Context, goalID uuid.UUID) (model.Goal, error)
	List(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error)
	GetByName(ctx context.Context, goalName string) (model.Goal, error)
	CreateContribution(ctx context.Context, contribution *model.GoalContribution) error
	ListContributions(ctx context.Context, goalID uuid.UUID) ([]model.GoalContribution, error)
}

type goalService struct {
	goalRepo repository.GoalRepository
}

func NewGoalService(goalRepo repository.GoalRepository) GoalService {
	return &goalService{goalRepo: goalRepo}
}

func (s *goalService) Create(ctx context.Context, goal *model.Goal) error {
	return s.goalRepo.Create(ctx, goal)
}

func (s *goalService) Update(ctx context.Context, goal model.Goal) error {
	return s.goalRepo.Update(ctx, goal)
}

func (s *goalService) Delete(ctx context.Context, goal model.Goal) error {
	return s.goalRepo.Delete(ctx, goal)
}

func (s *goalService) Get(ctx context.Context, goalID uuid.UUID) (model.Goal, error) {
	return s.goalRepo.Get(ctx, goalID)
}

func (s *goalService) List(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error) {
	return s.goalRepo.List(ctx, familyID, created_by_id)
}

func (s *goalService) GetByName(ctx context.Context, goalName string) (model.Goal, error) {
	return s.goalRepo.GetByName(ctx, goalName)
}

func (s *goalService) CreateContribution(ctx context.Context, contribution *model.GoalContribution) error {
	return s.goalRepo.CreateContribution(ctx, contribution)
}

func (s *goalService) ListContributions(ctx context.Context, goalID uuid.UUID) ([]model.GoalContribution, error) {
	return s.goalRepo.ListContributions(ctx, goalID)
}