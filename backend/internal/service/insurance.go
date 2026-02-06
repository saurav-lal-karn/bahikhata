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

	CreatePremium(req dto.CreatePremiumRequest) (*dto.PremiumResponse, error)
	GetPremiums(policyID uuid.UUID) ([]dto.PremiumResponse, error)

	CreateClaim(req dto.CreateClaimRequest) (*dto.ClaimResponse, error)
	GetClaims(policyID uuid.UUID) ([]dto.ClaimResponse, error)
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

func (s *insuranceService) CreatePremium(req dto.CreatePremiumRequest) (*dto.PremiumResponse, error) {
	dueDate, err := time.Parse("2006-01-02", req.DueDate)
	if err != nil {
		return nil, err
	}

	var paymentDate *time.Time
	if req.PaymentDate != nil {
		t, _ := time.Parse("2006-01-02", *req.PaymentDate)
		paymentDate = &t
	}

	premium := &model.Premium{
		PolicyID:    req.PolicyID,
		Amount:      req.Amount,
		DueDate:     dueDate,
		PaymentDate: paymentDate,
		Status:      "PENDING",
	}

	if paymentDate != nil {
		premium.Status = "PAID"
	}

	if err := s.repo.CreatePremium(premium); err != nil {
		return nil, err
	}

	res := dto.ToPremiumResponse(*premium)
	return &res, nil
}

func (s *insuranceService) GetPremiums(policyID uuid.UUID) ([]dto.PremiumResponse, error) {
	premiums, err := s.repo.GetPremiumsByPolicy(policyID)
	if err != nil {
		return nil, err
	}

	res := make([]dto.PremiumResponse, len(premiums))
	for i, p := range premiums {
		res[i] = dto.ToPremiumResponse(p)
	}
	return res, nil
}

func (s *insuranceService) CreateClaim(req dto.CreateClaimRequest) (*dto.ClaimResponse, error) {
	claimDate, err := time.Parse("2006-01-02", req.ClaimDate)
	if err != nil {
		return nil, err
	}

	claim := &model.Claim{
		PolicyID:      req.PolicyID,
		AmountClaimed: req.AmountClaimed,
		ClaimDate:     claimDate,
		Description:   req.Description,
		Status:        "SUBMITTED",
	}

	if err := s.repo.CreateClaim(claim); err != nil {
		return nil, err
	}

	res := dto.ToClaimResponse(*claim)
	return &res, nil
}

func (s *insuranceService) GetClaims(policyID uuid.UUID) ([]dto.ClaimResponse, error) {
	claims, err := s.repo.GetClaimsByPolicy(policyID)
	if err != nil {
		return nil, err
	}

	res := make([]dto.ClaimResponse, len(claims))
	for i, c := range claims {
		res[i] = dto.ToClaimResponse(c)
	}
	return res, nil
}
