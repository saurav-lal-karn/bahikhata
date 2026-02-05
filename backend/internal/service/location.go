package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type LocationService interface {
	Create(ctx context.Context, req dto.CreateLocationRequest) (*dto.LocationResponse, error)
	List(ctx context.Context, familyID uuid.UUID) ([]dto.LocationResponse, error)
	GetByID(ctx context.Context, id uuid.UUID) (*dto.LocationResponse, error)
	Update(ctx context.Context, id uuid.UUID, req dto.UpdateLocationRequest) (*dto.LocationResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type locationService struct {
	locationRepo repository.LocationRepository
}

func NewLocationService(locationRepo repository.LocationRepository) LocationService {
	return &locationService{locationRepo: locationRepo}
}

func (l *locationService) Create(ctx context.Context, req dto.CreateLocationRequest) (*dto.LocationResponse, error) {
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

	if err := l.locationRepo.Create(ctx, location); err != nil {
		return nil, err
	}

	return dto.ToLocationResponse(location), nil
}

func (l *locationService) List(ctx context.Context, familyID uuid.UUID) ([]dto.LocationResponse, error) {
	locations, err := l.locationRepo.ListByFamilyID(ctx, familyID)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.LocationResponse, len(locations))
	for i, l := range locations {
		resp[i] = *dto.ToLocationResponse(&l)
	}
	return resp, nil
}

func (l *locationService) GetByID(ctx context.Context, id uuid.UUID) (*dto.LocationResponse, error) {
	location, err := l.locationRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return dto.ToLocationResponse(location), nil
}

func (l *locationService) Update(ctx context.Context, id uuid.UUID, req dto.UpdateLocationRequest) (*dto.LocationResponse, error) {
	location, err := l.locationRepo.GetByID(ctx, id)
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

	if err := l.locationRepo.Update(ctx, location); err != nil {
		return nil, err
	}

	return dto.ToLocationResponse(location), nil
}

func (l *locationService) Delete(ctx context.Context, id uuid.UUID) error {
	return l.locationRepo.Delete(ctx, id)
}
