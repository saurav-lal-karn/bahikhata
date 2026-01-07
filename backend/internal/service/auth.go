package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService interface {
	Login(email string, password string) (*helper.JWTPayload, error)
	Register(firstname string, lastname string, email string, password string) (*helper.JWTPayload, error)
	Logout() error
	Refresh(refreshToken string) (*helper.JWTPayload, error)
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

	// Issue new access token
	accessToken, _, err := helper.GetJWT(claims, "access")
	if err != nil {
		return nil, err
	}

	// Issue new refresh token
	refreshToken, _, err := helper.GetJWT(claims, "refresh")
	if err != nil {
		return nil, err
	}

	jwtPayload := helper.JWTPayload{
		AccessJWT:  accessToken,
		RefreshJWT: refreshToken,
	}

	return &jwtPayload, nil
}

func(s *authService) Register(firstname string, lastname string, email string, password string) (*helper.JWTPayload, error) {
	_, err := s.userRepo.GetByEmail(email)
	if err == nil {
		return nil, errors.New("user already exists")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		FirstName: firstname,
		LastName:  lastname,
		Email:     email,
		Password:  string(hashedPassword),
	}

	user.ID = uuid.New()

	createdUser, err := s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}

	claims := helper.MyCustomClaims{
		UserId:  createdUser.ID.String(),
		Email:   createdUser.Email,
		Role:    createdUser.Role,
	}

	// Issue new access token
	accessToken, _, err := helper.GetJWT(claims, "access")
	if err != nil {
		return nil, err
	}

	// Issue new refresh token
	refreshToken, _, err := helper.GetJWT(claims, "refresh")
	if err != nil {
		return nil, err
	}

	jwtPayload := helper.JWTPayload{
		AccessJWT:  accessToken,
		RefreshJWT: refreshToken,
	}

	return &jwtPayload, nil
}

func(s *authService) Logout() error {
	return nil
}

func(s *authService) Refresh(refreshToken string) (*helper.JWTPayload, error) {
	// Validate the refresh token
	claims, err := helper.ValidateToken(refreshToken)
	if err != nil {
		return nil, err
	}

	// Create new claims (reuse existing user info from token)
	// Optionally we could fetch fresh user from DB here to ensure active status
	newClaims := helper.MyCustomClaims{
		UserId: claims.UserId,
		Email:  claims.Email,
		Role:   claims.Role,
	}

	// Issue new access token
	newAccessToken, _, err := helper.GetJWT(newClaims, "access")
	if err != nil {
		return nil, err
	}

	// Issue new refresh token
	newRefreshToken, _, err := helper.GetJWT(newClaims, "refresh")
	if err != nil {
		return nil, err
	}

	return &helper.JWTPayload{
		AccessJWT:  newAccessToken,
		RefreshJWT: newRefreshToken,
	}, nil
}

func(s *authService) ForgotPassword(email string) error {
	return nil
}
