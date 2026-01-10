package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
)

type FamilyMemberService interface {
	CreateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	GetFamilyMemberById(ctx context.Context, id string) (*model.FamilyMember, error)
	GetFamilyMembersByFamilyId(ctx context.Context, familyId string) ([]model.User, error)
	UpdateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	DeleteFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
}

type familyMemberService struct {
	familyMemberRepository repository.FamilyMemberRepository
	userRepository         repository.UserRepository
	familyRepository       repository.FamilyRepository
}

func NewFamilyMemberService(familyMemberRepository repository.FamilyMemberRepository, userRepository repository.UserRepository, familyRepository repository.FamilyRepository) FamilyMemberService {
	return &familyMemberService{familyMemberRepository: familyMemberRepository, userRepository: userRepository, familyRepository: familyRepository}
}

func (s *familyMemberService) CreateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	_, err := s.userRepository.GetUserById(ctx, familyMember.UserID)
	if err != nil {
		return errors.New("User not found")
	}

	_, err = s.familyRepository.GetFamilyById(ctx, familyMember.FamilyID)
	if err != nil {
		return errors.New("Family not found")
	}

	isUserInFamily, err := s.familyMemberRepository.CheckUserInFamily(ctx, familyMember.FamilyID, familyMember.UserID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	if isUserInFamily {
		return errors.New("User already in family")
	}

	familyMember.ID = uuid.New()
	
	return s.familyMemberRepository.CreateFamilyMember(ctx, familyMember)
}

func (s *familyMemberService) GetFamilyMemberById(ctx context.Context, id string) (*model.FamilyMember, error) {
	return s.familyMemberRepository.GetFamilyMemberById(ctx, id)
}

func (s *familyMemberService) GetFamilyMembersByFamilyId(ctx context.Context, familyId string) ([]model.User, error) {
	return s.familyMemberRepository.GetFamilyMembersByFamilyId(ctx, familyId)
}

func (s *familyMemberService) UpdateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	return s.familyMemberRepository.UpdateFamilyMember(ctx, familyMember)
}

func (s *familyMemberService) DeleteFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	return s.familyMemberRepository.DeleteFamilyMember(ctx, familyMember)
}
