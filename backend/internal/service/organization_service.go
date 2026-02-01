package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type OrganizationService interface {
	CreateTag(ctx context.Context, req dto.CreateTagRequest) (*dto.TagResponse, error)
	GetTags(ctx context.Context, familyID uuid.UUID) ([]dto.TagResponse, error)
	CreateProject(ctx context.Context, req dto.CreateProjectRequest) (*dto.ProjectResponse, error)
	GetProjects(ctx context.Context, familyID uuid.UUID) ([]dto.ProjectResponse, error)
}

type organizationService struct {
	repo repository.OrganizationRepository
}

func NewOrganizationService(repo repository.OrganizationRepository) OrganizationService {
	return &organizationService{repo: repo}
}

func (s *organizationService) CreateTag(ctx context.Context, req dto.CreateTagRequest) (*dto.TagResponse, error) {
	familyID, err := uuid.Parse(req.FamilyID)
	if err != nil {
		return nil, err
	}

	tag := &model.Tag{
		FamilyID: familyID,
		Name:     req.Name,
		Color:    req.Color,
	}

	if err := s.repo.CreateTag(ctx, tag); err != nil {
		return nil, err
	}

	return dto.ToTagResponse(tag), nil
}

func (s *organizationService) GetTags(ctx context.Context, familyID uuid.UUID) ([]dto.TagResponse, error) {
	tags, err := s.repo.ListTags(ctx, familyID)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.TagResponse, len(tags))
	for i, t := range tags {
		resp[i] = *dto.ToTagResponse(&t)
	}
	return resp, nil
}

func (s *organizationService) CreateProject(ctx context.Context, req dto.CreateProjectRequest) (*dto.ProjectResponse, error) {
	familyID, err := uuid.Parse(req.FamilyID)
	if err != nil {
		return nil, err
	}

	project := &model.Project{
		FamilyID:    familyID,
		Name:        req.Name,
		Description: req.Description,
	}

	if err := s.repo.CreateProject(ctx, project); err != nil {
		return nil, err
	}

	return dto.ToProjectResponse(project), nil
}

func (s *organizationService) GetProjects(ctx context.Context, familyID uuid.UUID) ([]dto.ProjectResponse, error) {
	projects, err := s.repo.ListProjects(ctx, familyID)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.ProjectResponse, len(projects))
	for i, p := range projects {
		resp[i] = *dto.ToProjectResponse(&p)
	}
	return resp, nil
}
