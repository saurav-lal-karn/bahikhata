package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type ProjectRepository interface {
	Create(ctx context.Context, project *model.Project) error
	List(ctx context.Context, familyID uuid.UUID) ([]model.Project, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Project, error)
	Update(ctx context.Context, project *model.Project) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type projectRepo struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) ProjectRepository {
	return &projectRepo{db: db}
}

func (r *projectRepo) Create(ctx context.Context, project *model.Project) error {
	return r.db.WithContext(ctx).Create(project).Error
}

func (r *projectRepo) List(ctx context.Context, familyID uuid.UUID) ([]model.Project, error) {
	var projects []model.Project
	if err := r.db.WithContext(ctx).Where("family_id = ?", familyID).Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *projectRepo) GetByID(ctx context.Context, id uuid.UUID) (*model.Project, error) {
	var project model.Project
	if err := r.db.WithContext(ctx).First(&project, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *projectRepo) Update(ctx context.Context, project *model.Project) error {
	return r.db.WithContext(ctx).Save(project).Error
}

func (r *projectRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Project{}, "id = ?", id).Error
}
