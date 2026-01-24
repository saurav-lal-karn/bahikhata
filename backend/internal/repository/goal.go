package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type GoalRepository interface {
	Create(ctx context.Context, goal *model.Goal) error
	Update(ctx context.Context, goal model.Goal) error
	Delete(ctx context.Context, goal model.Goal) error
	Get(ctx context.Context, goalID uuid.UUID) (model.Goal, error)
	List(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error)
	GetByName(ctx context.Context, goalName string) (model.Goal, error)
}

type goalRepository struct {
	DB *gorm.DB
}

func NewGoalRepository(db *gorm.DB) GoalRepository {
	return &goalRepository{DB: db}
}

func (r *goalRepository) Create(ctx context.Context, goal *model.Goal) error {
	return r.DB.WithContext(ctx).Create(goal).Error
}

func (r *goalRepository) Update(ctx context.Context, goal model.Goal) error {
	return r.DB.WithContext(ctx).Save(&goal).Error
}

func (r *goalRepository) Delete(ctx context.Context, goal model.Goal) error {
	return r.DB.WithContext(ctx).Delete(&goal).Error
}

func (r *goalRepository) Get(ctx context.Context, goalID uuid.UUID) (model.Goal, error) {
	var goal model.Goal
	return goal, r.DB.WithContext(ctx).First(&goal, "id = ?", goalID).Error
}

func (r *goalRepository) List(ctx context.Context, familyID uuid.UUID, created_by_id uuid.UUID) ([]model.Goal, error) {
	var goals []model.Goal
	return goals, r.DB.WithContext(ctx).Where("family_id = ? AND user_id = ?", familyID, created_by_id).Find(&goals).Error
}

func (r *goalRepository) GetByName(ctx context.Context, goalName string) (model.Goal, error) {
	var goal model.Goal
	return goal, r.DB.WithContext(ctx).First(&goal, "name = ?", goalName).Error
}