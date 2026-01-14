package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type FamilyMemberService interface {
	CreateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	GetFamilyMemberById(ctx context.Context, id string) (*model.FamilyMember, error)
	GetFamilyMembersByFamilyId(ctx context.Context, familyId string) ([]model.User, error)
	UpdateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	DeleteFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	InviteMember(ctx context.Context, inviteMemberRequest dto.InviteMemberRequest, createdByUserID uuid.UUID) error
}

type familyMemberService struct {
	familyMemberRepository repository.FamilyMemberRepository
	userRepository         repository.UserRepository
	familyRepository       repository.FamilyRepository
	emailService           EmailService
	env                    *config.Env
}

func NewFamilyMemberService(familyMemberRepository repository.FamilyMemberRepository, userRepository repository.UserRepository, familyRepository repository.FamilyRepository, emailService EmailService, env *config.Env) FamilyMemberService {
	return &familyMemberService{
		familyMemberRepository: familyMemberRepository,
		userRepository:         userRepository,
		familyRepository:       familyRepository,
		emailService:           emailService,
		env:                    env,
	}
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

func (s *familyMemberService) InviteMember(ctx context.Context, inviteMemberRequest dto.InviteMemberRequest, createdByUserID uuid.UUID) error {
	existingUser, err := s.userRepository.GetByEmail(ctx, inviteMemberRequest.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	
	if errors.Is(err, gorm.ErrRecordNotFound) || existingUser == nil {
		// User not found, Create the user
		user := model.User{
			FirstName: inviteMemberRequest.FirstName,
			LastName:  inviteMemberRequest.LastName,
			Email:     inviteMemberRequest.Email,
			Role:      inviteMemberRequest.Role,
			UserName:  inviteMemberRequest.Email,
		}
		user.ID = uuid.New()
		
		// Generate a secure random password for the new user
		randomPassword, err := helper.GenerateRandomPassword(16)
		if err != nil {
			return errors.New("failed to generate password")
		}
		
		// Hash the password before storing
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)
		if err != nil {
			return errors.New("failed to hash password")
		}
		user.Password = string(hashedPassword)

		if _, err := s.userRepository.Create(ctx, &user); err != nil {
			return err
		}

		familyMember := model.FamilyMember{
			FamilyID: inviteMemberRequest.FamilyID,
			UserID:   user.ID,
			Role:     inviteMemberRequest.Role,
			CreatedByUserID: createdByUserID,
		}
		familyMember.ID = uuid.New()

		if err := s.familyMemberRepository.CreateFamilyMember(ctx, &familyMember); err != nil {
			return err
		}

		inviteLink := s.env.ClientUrl + "/register?email=" + inviteMemberRequest.Email

		// Send invitation email (currently logs it)
		if err := s.emailService.SendInvitationEmail(inviteMemberRequest.Email, inviteMemberRequest.FirstName, inviteMemberRequest.Role, randomPassword, inviteLink); err != nil {
			return errors.New("Failed to send invitation")
		}
	} else {
		// Add existing user to the family and send the invitation email
		familyMember := model.FamilyMember{
			FamilyID: inviteMemberRequest.FamilyID,
			UserID:   existingUser.ID,
			Role:     inviteMemberRequest.Role,
		}
		familyMember.ID = uuid.New()

		if err := s.familyMemberRepository.CreateFamilyMember(ctx, &familyMember); err != nil {
			return err
		}

		inviteLink := s.env.ClientUrl + "/register?email=" + inviteMemberRequest.Email

		// Send invitation email (currently logs it)
		if err := s.emailService.SendInvitationEmailToExistingUser(inviteMemberRequest.Email, inviteMemberRequest.FirstName, inviteMemberRequest.Role, inviteLink); err != nil {
			return errors.New("Failed to send invitation")
		}
	}

	return nil
}
