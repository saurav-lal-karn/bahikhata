package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type FamilyService interface {
	CreateFamily(ctx context.Context, family *model.Family) error
	GetFamilyById(ctx context.Context, id uuid.UUID) (*model.Family, error)
	ListFamilies(ctx context.Context) ([]model.Family, error)
	UpdateFamily(ctx context.Context, family *model.Family) error
	DeleteFamily(ctx context.Context, id uuid.UUID) error
	GetFamilyStats(ctx context.Context, id uuid.UUID) (*model.FamilyStats, error)
}

type familyService struct {
	repo repository.FamilyRepository
}

func NewFamilyService(repo repository.FamilyRepository) FamilyService {
	return &familyService{repo: repo}
}

func (s *familyService) CreateFamily(ctx context.Context, family *model.Family) error {
	family.ID = uuid.New()
	return s.repo.CreateFamily(ctx, family)
}

func (s *familyService) GetFamilyById(ctx context.Context, id uuid.UUID) (*model.Family, error) {
	return s.repo.GetFamilyById(ctx, id)
}

func (s *familyService) ListFamilies(ctx context.Context) ([]model.Family, error) {
	return s.repo.ListFamilies(ctx)
}

func (s *familyService) UpdateFamily(ctx context.Context, family *model.Family) error {
	return s.repo.UpdateFamily(ctx, family)
}

func (s *familyService) DeleteFamily(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteFamily(ctx, id)
}

func (s *familyService) GetFamilyStats(ctx context.Context, id uuid.UUID) (*model.FamilyStats, error) {
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
