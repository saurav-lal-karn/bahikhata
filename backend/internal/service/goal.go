package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type GoalService interface {
	CreateGoal(ctx context.Context, goal *model.Goal) error
	UpdateGoal(ctx context.Context, goal model.Goal) error
	DeleteGoal(ctx context.Context, goal model.Goal) error
	GetGoal(ctx context.Context, goalID uuid.UUID) (model.Goal, error)
	GetGoals(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error)
	GetGoalByName(ctx context.Context, goalName string) (model.Goal, error)
}

type goalService struct {
	goalRepo repository.GoalRepository
}

func NewGoalService(goalRepo repository.GoalRepository) GoalService {
	return &goalService{goalRepo: goalRepo}
}

func (s *goalService) CreateGoal(ctx context.Context, goal *model.Goal) error {
	return s.goalRepo.CreateGoal(ctx, goal)
}

func (s *goalService) UpdateGoal(ctx context.Context, goal model.Goal) error {
	return s.goalRepo.UpdateGoal(ctx, goal)
}

func (s *goalService) DeleteGoal(ctx context.Context, goal model.Goal) error {
	return s.goalRepo.DeleteGoal(ctx, goal)
}

func (s *goalService) GetGoal(ctx context.Context, goalID uuid.UUID) (model.Goal, error) {
	return s.goalRepo.GetGoal(ctx, goalID)
}

func (s *goalService) GetGoals(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error) {
	return s.goalRepo.GetGoals(ctx, familyID, created_by_id)
}

func (s *goalService) GetGoalByName(ctx context.Context, goalName string) (model.Goal, error) {
	return s.goalRepo.GetGoalByName(ctx, goalName)
}