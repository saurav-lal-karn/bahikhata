package service

import (
	"errors"

	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type AuthService interface {
	Login(email string, password string) (*helper.JWTPayload, error)
	Register(email string, password string) (*model.User, error)
	Logout() error
	Refresh() error
	ForgotPassword(email string) error
}

type authService struct {
	userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
	return &authService{userRepo: userRepo}
}

func (s *authService) Login(email string, password string) (*helper.JWTPayload, error) {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}
	if err := user.ComparePassword(password); err != nil {
		return nil, errors.New("Invalid password")
	}

	claims := helper.MyCustomClaims{
		UserId:  user.ID.String(),
		Email:   user.Email,
		Role:    user.Role,
	}

	// Issue new tokens
	accessToken, refreshToken, err := helper.GetJWT(claims, "access")
	if err != nil {
		return nil, err
	}

	jwtPayload := helper.JWTPayload{
		AccessJWT:  accessToken,
		RefreshJWT: refreshToken,
	}

	return &jwtPayload, nil
}

func(s *authService) Register(email string, password string) (*model.User, error) {
	return s.userRepo.GetByEmail(email)
}

func(s *authService) Logout() error {
	return nil
}

func(s *authService) Refresh() error {
	return nil
}

func(s *authService) ForgotPassword(email string) error {
	return nil
}
