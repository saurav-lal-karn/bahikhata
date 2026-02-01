package repository

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type InsuranceRepository interface {
	CreatePolicy(policy *model.InsurancePolicy) error
	GetPolicies(familyID uuid.UUID) ([]model.InsurancePolicy, error)
	GetPolicyByID(id uuid.UUID) (*model.InsurancePolicy, error)
	UpdatePolicy(policy *model.InsurancePolicy) error
	DeletePolicy(id uuid.UUID) error

	CreatePremium(premium *model.Premium) error
	GetPremiumsByPolicy(policyID uuid.UUID) ([]model.Premium, error)
	UpdatePremium(premium *model.Premium) error

	CreateClaim(claim *model.Claim) error
	GetClaimsByPolicy(policyID uuid.UUID) ([]model.Claim, error)
}

type insuranceRepository struct {
	db *gorm.DB
}

func NewInsuranceRepository(db *gorm.DB) InsuranceRepository {
	return &insuranceRepository{db: db}
}

func (r *insuranceRepository) CreatePolicy(policy *model.InsurancePolicy) error {
	return r.db.Create(policy).Error
}

func (r *insuranceRepository) GetPolicies(familyID uuid.UUID) ([]model.InsurancePolicy, error) {
	var policies []model.InsurancePolicy
	err := r.db.Where("family_id = ?", familyID).Preload("Provider").Find(&policies).Error
	return policies, err
}

func (r *insuranceRepository) GetPolicyByID(id uuid.UUID) (*model.InsurancePolicy, error) {
	var policy model.InsurancePolicy
	err := r.db.Preload("Provider").Preload("Premiums").Preload("Claims").First(&policy, id).Error
	return &policy, err
}

func (r *insuranceRepository) UpdatePolicy(policy *model.InsurancePolicy) error {
	return r.db.Save(policy).Error
}

func (r *insuranceRepository) DeletePolicy(id uuid.UUID) error {
	return r.db.Delete(&model.InsurancePolicy{}, id).Error
}

func (r *insuranceRepository) CreatePremium(premium *model.Premium) error {
	return r.db.Create(premium).Error
}

func (r *insuranceRepository) GetPremiumsByPolicy(policyID uuid.UUID) ([]model.Premium, error) {
	var premiums []model.Premium
	err := r.db.Where("policy_id = ?", policyID).Order("due_date desc").Find(&premiums).Error
	return premiums, err
}

func (r *insuranceRepository) UpdatePremium(premium *model.Premium) error {
	return r.db.Save(premium).Error
}

func (r *insuranceRepository) CreateClaim(claim *model.Claim) error {
	return r.db.Create(claim).Error
}

func (r *insuranceRepository) GetClaimsByPolicy(policyID uuid.UUID) ([]model.Claim, error) {
	var claims []model.Claim
	err := r.db.Where("policy_id = ?", policyID).Order("claim_date desc").Find(&claims).Error
	return claims, err
}
