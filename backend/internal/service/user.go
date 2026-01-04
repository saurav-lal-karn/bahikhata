package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	ListUsers() ([]model.User, error)
	CreateUser(user *model.User) error
	GetUserById(id uuid.UUID) (*model.User, error)
	UpdateUser(user *model.User) error
	DeleteUser(id uuid.UUID) error
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) CreateUser(user *model.User) error {
	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// Check if user already exists
	_, err = s.repo.GetByEmail(user.Email)
	if err == nil {
		return errors.New("user already exists")
	}

	user.ID = uuid.New()
	// Set other defaults if necessary
	
	return s.repo.Create(user)
}

func (s *userService) ListUsers() ([]model.User, error) {
	return s.repo.ListUsers()
}

func (s *userService) GetUserById(id uuid.UUID) (*model.User, error) {
	return s.repo.GetUserById(id)
}

func (s *userService) UpdateUser(user *model.User) error {
	return s.repo.UpdateUser(user)
}

func (s *userService) DeleteUser(id uuid.UUID) error {
	return s.repo.DeleteUser(id)
}
