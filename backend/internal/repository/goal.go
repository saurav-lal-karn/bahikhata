package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type GoalRepository interface {
	Create(ctx context.Context, goal *model.Goal) (*model.Goal, error)
	Update(ctx context.Context, id uuid.UUID, goal *model.Goal) (*model.Goal, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, goalID uuid.UUID) (*model.Goal, error)
	List(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error)
	GetByName(ctx context.Context, goalName string) (*model.Goal, error)
	CreateContribution(ctx context.Context, contribution *model.GoalContribution) error
	ListContributions(ctx context.Context, goalID uuid.UUID) ([]model.GoalContribution, error)
}

type goalRepository struct {
	db *gorm.DB
}

func NewGoalRepository(db *gorm.DB) GoalRepository {
	return &goalRepository{db: db}
}

func (r *goalRepository) Create(ctx context.Context, goal *model.Goal) (*model.Goal, error) {
	if err := r.db.WithContext(ctx).Create(goal).Error; err != nil {
		return nil, err
	}
	return goal, nil
}

func (r *goalRepository) List(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error) {
	var goals []model.Goal
	return goals, r.db.WithContext(ctx).Where("family_id = ? AND user_id = ?", familyID, created_by_id).Find(&goals).Error
}

func (r *goalRepository) GetByName(ctx context.Context, goalName string) (*model.Goal, error) {
	var goal model.Goal
	if err := r.db.WithContext(ctx).First(&goal, "name = ?", goalName).Error; err != nil {
		return nil, err
	}
	return &goal, nil
}

func (r *goalRepository) GetByID(ctx context.Context, goalID uuid.UUID) (*model.Goal, error) {
	var goal model.Goal
	if err := r.db.WithContext(ctx).First(&goal, "id = ?", goalID).Error; err != nil {
		return nil, err
	}
	return &goal, nil
}

func (r *goalRepository) Update(ctx context.Context,id uuid.UUID, goal *model.Goal) (*model.Goal, error) {
	result := r.db.WithContext(ctx).Model(&model.Goal{}).Where("id = ?", goal.ID).Updates(goal)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update transaction %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return r.GetByID(ctx, id)
}

func (r *goalRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Goal{}, "id = ?", id).Error
}

func (r *goalRepository) CreateContribution(ctx context.Context, contribution *model.GoalContribution) error {
	return r.db.WithContext(ctx).Create(contribution).Error
}

func (r *goalRepository) ListContributions(ctx context.Context, goalID uuid.UUID) ([]model.GoalContribution, error) {
	var contributions []model.GoalContribution
	return contributions, r.db.WithContext(ctx).Preload("Transaction").Where("goal_id = ?", goalID).Order("contribution_date desc").Find(&contributions).Error
}