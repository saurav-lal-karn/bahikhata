package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type FamilyService interface {
	Create(ctx context.Context, family *model.Family) error
	GetByID(ctx context.Context, id uuid.UUID) (*model.Family, error)
	List(ctx context.Context) ([]model.Family, error)
	Update(ctx context.Context, family *model.Family) error
	Delete(ctx context.Context, id uuid.UUID) error
	GetStats(ctx context.Context, id uuid.UUID) (*model.FamilyStats, error)
}

type familyService struct {
	repo repository.FamilyRepository
}

func NewFamilyService(repo repository.FamilyRepository) FamilyService {
	return &familyService{repo: repo}
}

func (s *familyService) Create(ctx context.Context, family *model.Family) error {
	family.ID = uuid.New()
	return s.repo.Create(ctx, family)
}

func (s *familyService) GetByID(ctx context.Context, id uuid.UUID) (*model.Family, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *familyService) List(ctx context.Context) ([]model.Family, error) {
	return s.repo.List(ctx)
}

func (s *familyService) Update(ctx context.Context, family *model.Family) error {
	return s.repo.Update(ctx, family)
}

func (s *familyService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}

func (s *familyService) GetStats(ctx context.Context, id uuid.UUID) (*model.FamilyStats, error) {
	var stats model.FamilyStats
	stats.TotalUsers = 0
	stats.TotalMembers = 0
	stats.TotalAdministrators = 0
	stats.TotalPendingInvites = 0
	stats.TotalLedgers = 0
	stats.TotalTransactions = 0
	stats.TotalAmount = 0
	return &stats, nil
}
