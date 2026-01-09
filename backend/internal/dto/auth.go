package dto

import "github.com/sauravkarn541/bahikhata/internal/model"

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type RegisterRequest struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	UserName  string `json:"user_name" binding:"required"`
	Password  string `json:"password" binding:"required,min=6"`
}

type RegisterResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type RefreshResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type LogoutResponse struct {
	Message string `json:"message"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ForgotPasswordResponse struct {
	Message string `json:"message"`
}

func (req *RegisterRequest) ToUser() *model.User {
	return &model.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		UserName:  req.UserName,
		Email:     req.Email,
		Password:  req.Password,
	}
}
