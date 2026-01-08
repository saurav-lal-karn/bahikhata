package service

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type FamilyService interface {
	CreateFamily(family *model.Family) (error)
	GetFamilyById(id uuid.UUID) (*model.Family, error)
	ListFamilies() ([]model.Family, error)
	UpdateFamily(family *model.Family) error
	DeleteFamily(id uuid.UUID) error
}

type familyService struct {
	repo repository.FamilyRepository
}

func NewFamilyService(repo repository.FamilyRepository) FamilyService {
	return &familyService{repo: repo}
}

func (s *familyService) CreateFamily(family *model.Family) error {
	family.ID = uuid.New()
	return s.repo.CreateFamily(family)
}

func (s *familyService) GetFamilyById(id uuid.UUID) (*model.Family, error) {
	return s.repo.GetFamilyById(id)
}

func (s *familyService) ListFamilies() ([]model.Family, error) {
	return s.repo.ListFamilies()
}

func (s *familyService) UpdateFamily(family *model.Family) error {
	return s.repo.UpdateFamily(family)
}

func (s *familyService) DeleteFamily(id uuid.UUID) error {
	return s.repo.DeleteFamily(id)
}