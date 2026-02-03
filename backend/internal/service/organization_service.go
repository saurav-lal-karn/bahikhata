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
	UpdateTag(ctx context.Context, id uuid.UUID, req dto.UpdateTagRequest) (*dto.TagResponse, error)
	DeleteTag(ctx context.Context, id uuid.UUID) error

	CreateProject(ctx context.Context, req dto.CreateProjectRequest) (*dto.ProjectResponse, error)
	GetProjects(ctx context.Context, familyID uuid.UUID) ([]dto.ProjectResponse, error)
	UpdateProject(ctx context.Context, id uuid.UUID, req dto.UpdateProjectRequest) (*dto.ProjectResponse, error)
	DeleteProject(ctx context.Context, id uuid.UUID) error

	CreateLocation(ctx context.Context, req dto.CreateLocationRequest) (*dto.LocationResponse, error)
	GetLocations(ctx context.Context, familyID uuid.UUID) ([]dto.LocationResponse, error)
	GetLocation(ctx context.Context, id uuid.UUID) (*dto.LocationResponse, error)
	UpdateLocation(ctx context.Context, id uuid.UUID, req dto.UpdateLocationRequest) (*dto.LocationResponse, error)
	DeleteLocation(ctx context.Context, id uuid.UUID) error
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

func (s *organizationService) UpdateTag(ctx context.Context, id uuid.UUID, req dto.UpdateTagRequest) (*dto.TagResponse, error) {
	tag, err := s.repo.GetTagByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		tag.Name = req.Name
	}
	if req.Color != "" {
		tag.Color = req.Color
	}

	if err := s.repo.UpdateTag(ctx, tag); err != nil {
		return nil, err
	}

	return dto.ToTagResponse(tag), nil
}

func (s *organizationService) DeleteTag(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteTag(ctx, id)
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

func (s *organizationService) UpdateProject(ctx context.Context, id uuid.UUID, req dto.UpdateProjectRequest) (*dto.ProjectResponse, error) {
	project, err := s.repo.GetProjectByID(ctx, id)
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

	if err := s.repo.UpdateProject(ctx, project); err != nil {
		return nil, err
	}

	return dto.ToProjectResponse(project), nil
}

func (s *organizationService) DeleteProject(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteProject(ctx, id)
}

func (s *organizationService) CreateLocation(ctx context.Context, req dto.CreateLocationRequest) (*dto.LocationResponse, error) {
	location := &model.Location{
		Name:      req.Name,
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Address:   req.Address,
	}

	if req.FamilyID != "" {
		familyID, err := uuid.Parse(req.FamilyID)
		if err != nil {
			return nil, err
		}
		location.FamilyID = &familyID
	}

	if err := s.repo.CreateLocation(ctx, location); err != nil {
		return nil, err
	}

	return dto.ToLocationResponse(location), nil
}

func (s *organizationService) GetLocations(ctx context.Context, familyID uuid.UUID) ([]dto.LocationResponse, error) {
	locations, err := s.repo.ListLocationsByFamily(ctx, familyID)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.LocationResponse, len(locations))
	for i, l := range locations {
		resp[i] = *dto.ToLocationResponse(&l)
	}
	return resp, nil
}

func (s *organizationService) GetLocation(ctx context.Context, id uuid.UUID) (*dto.LocationResponse, error) {
	location, err := s.repo.GetLocationByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return dto.ToLocationResponse(location), nil
}

func (s *organizationService) UpdateLocation(ctx context.Context, id uuid.UUID, req dto.UpdateLocationRequest) (*dto.LocationResponse, error) {
	location, err := s.repo.GetLocationByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		location.Name = req.Name
	}
	if req.Address != "" {
		location.Address = req.Address
	}
	if req.Latitude != nil {
		location.Latitude = req.Latitude
	}
	if req.Longitude != nil {
		location.Longitude = req.Longitude
	}

	if err := s.repo.UpdateLocation(ctx, location); err != nil {
		return nil, err
	}

	return dto.ToLocationResponse(location), nil
}

func (s *organizationService) DeleteLocation(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteLocation(ctx, id)
}
