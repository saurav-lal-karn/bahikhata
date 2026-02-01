package service

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type InsuranceService interface {
	CreatePolicy(req dto.CreateInsurancePolicyRequest) (*dto.InsurancePolicyResponse, error)
	GetPolicies(familyID uuid.UUID) ([]dto.InsurancePolicyResponse, error)
	GetPolicy(id uuid.UUID) (*dto.InsurancePolicyResponse, error)
	DeletePolicy(id uuid.UUID) error
}

type insuranceService struct {
	repo repository.InsuranceRepository
}

func NewInsuranceService(repo repository.InsuranceRepository) InsuranceService {
	return &insuranceService{repo: repo}
}

func (s *insuranceService) CreatePolicy(req dto.CreateInsurancePolicyRequest) (*dto.InsurancePolicyResponse, error) {
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		startDate, _ = time.Parse("2006-01-02", req.StartDate)
	}

	var endDate *time.Time
	if req.EndDate != nil {
		t, _ := time.Parse("2006-01-02", *req.EndDate)
		endDate = &t
	}

	policy := &model.InsurancePolicy{
		FamilyID:         req.FamilyID,
		ContactID:        req.ContactID,
		PolicyName:       req.PolicyName,
		PolicyNumber:     req.PolicyNumber,
		Type:             model.InsurancePolicyType(req.Type),
		PremiumAmount:    req.PremiumAmount,
		PremiumFrequency: model.RecurringFrequency(req.PremiumFrequency),
		SumAssured:       req.SumAssured,
		StartDate:        startDate,
		EndDate:          endDate,
		Status:           model.InsuranceActive,
	}

	if err := s.repo.CreatePolicy(policy); err != nil {
		return nil, err
	}

	// Fetch with preloads
	created, _ := s.repo.GetPolicyByID(policy.ID)
	res := dto.ToInsurancePolicyResponse(*created)
	return &res, nil
}

func (s *insuranceService) GetPolicies(familyID uuid.UUID) ([]dto.InsurancePolicyResponse, error) {
	policies, err := s.repo.GetPolicies(familyID)
	if err != nil {
		return nil, err
	}

	res := make([]dto.InsurancePolicyResponse, len(policies))
	for i, p := range policies {
		res[i] = dto.ToInsurancePolicyResponse(p)
	}
	return res, nil
}

func (s *insuranceService) GetPolicy(id uuid.UUID) (*dto.InsurancePolicyResponse, error) {
	policy, err := s.repo.GetPolicyByID(id)
	if err != nil {
		return nil, err
	}
	res := dto.ToInsurancePolicyResponse(*policy)
	return &res, nil
}

func (s *insuranceService) DeletePolicy(id uuid.UUID) error {
	return s.repo.DeletePolicy(id)
}
