package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	List(ctx context.Context) ([]model.User, error)
	Create(ctx context.Context, user *model.User) error
	GetByID(ctx context.Context, id uuid.UUID) (*model.User, error)
	Update(ctx context.Context, id uuid.UUID, user *model.User) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) Create(ctx context.Context, user *model.User) error {
	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// Check if user already exists
	_, err = s.repo.GetByEmail(ctx, user.Email)
	if err == nil {
		return errors.New("user already exists")
	}

	user.ID = uuid.New()
	// Set other defaults if necessary

	_, err = s.repo.Create(ctx, user)
	if err != nil {
		return err
	}
	return nil
}

func (s *userService) List(ctx context.Context) ([]model.User, error) {
	return s.repo.List(ctx)
}

func (s *userService) GetByID(ctx context.Context, id uuid.UUID) (*model.User, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *userService) Update(ctx context.Context, id uuid.UUID, user *model.User) error {
	return s.repo.Update(ctx, id, user)
}

func (s *userService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
