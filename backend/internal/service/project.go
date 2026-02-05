package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type ProjectService interface {
	Create(ctx context.Context, req dto.CreateProjectRequest) (*dto.ProjectResponse, error)
	List(ctx context.Context, familyID uuid.UUID) ([]dto.ProjectResponse, error)
	Update(ctx context.Context, id uuid.UUID, req dto.UpdateProjectRequest) (*dto.ProjectResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*dto.ProjectResponse, error)
}

type projectService struct {
	projectRepo repository.ProjectRepository
}

func NewProjectService(projectRepo repository.ProjectRepository) ProjectService {
	return &projectService{projectRepo: projectRepo}
}

func (p *projectService) Create(ctx context.Context, req dto.CreateProjectRequest) (*dto.ProjectResponse, error) {
	familyID, err := uuid.Parse(req.FamilyID)
	if err != nil {
		return nil, err
	}

	project := &model.Project{
		FamilyID:    familyID,
		Name:        req.Name,
		Description: req.Description,
	}

	if err := p.projectRepo.Create(ctx, project); err != nil {
		return nil, err
	}

	return dto.ToProjectResponse(project), nil
}

func (p *projectService) List(ctx context.Context, familyID uuid.UUID) ([]dto.ProjectResponse, error) {
	projects, err := p.projectRepo.List(ctx, familyID)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.ProjectResponse, len(projects))
	for i, p := range projects {
		resp[i] = *dto.ToProjectResponse(&p)
	}
	return resp, nil
}

func (p *projectService) Update(ctx context.Context, id uuid.UUID, req dto.UpdateProjectRequest) (*dto.ProjectResponse, error) {
	project, err := p.projectRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		project.Name = req.Name
	}
	if req.Description != "" {
		project.Description = req.Description
	}
	if req.IsActive != nil {
		project.IsActive = *req.IsActive
	}

	if err := p.projectRepo.Update(ctx, project); err != nil {
		return nil, err
	}

	return dto.ToProjectResponse(project), nil
}

func (p *projectService) Delete(ctx context.Context, id uuid.UUID) error {
	return p.projectRepo.Delete(ctx, id)
}

func (p *projectService) GetByID(ctx context.Context, id uuid.UUID) (*dto.ProjectResponse, error) {
	project, err := p.projectRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return dto.ToProjectResponse(project), nil
}