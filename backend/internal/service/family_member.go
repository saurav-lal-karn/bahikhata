package service

import (
	"context"

	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type FamilyMemberService interface {
	CreateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	GetFamilyMemberById(ctx context.Context, id string) (*model.FamilyMember, error)
	GetFamilyMembersByFamilyId(ctx context.Context, familyId string) ([]model.FamilyMember, error)
	UpdateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	DeleteFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
}

type familyMemberService struct {
	familyMemberRepository repository.FamilyMemberRepository
}

func NewFamilyMemberService(familyMemberRepository repository.FamilyMemberRepository) FamilyMemberService {
	return &familyMemberService{familyMemberRepository: familyMemberRepository}
}

func (s *familyMemberService) CreateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	return s.familyMemberRepository.CreateFamilyMember(ctx, familyMember)
}

func (s *familyMemberService) GetFamilyMemberById(ctx context.Context, id string) (*model.FamilyMember, error) {
	return s.familyMemberRepository.GetFamilyMemberById(ctx, id)
}

func (s *familyMemberService) GetFamilyMembersByFamilyId(ctx context.Context, familyId string) ([]model.FamilyMember, error) {
	return s.familyMemberRepository.GetFamilyMembersByFamilyId(ctx, familyId)
}

func (s *familyMemberService) UpdateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	return s.familyMemberRepository.UpdateFamilyMember(ctx, familyMember)
}

func (s *familyMemberService) DeleteFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	return s.familyMemberRepository.DeleteFamilyMember(ctx, familyMember)
}
