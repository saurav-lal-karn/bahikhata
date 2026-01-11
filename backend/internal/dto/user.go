package dto

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

// UserResponse controls exactly what the client sees
type UserResponse struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	UserName  string    `json:"user_name"`
	Role      string    `json:"role"`
	// No Password field here!
}

// CreateUserRequest handles validation for incoming data
type CreateUserRequest struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
}

func (req *CreateUserRequest) ToUser() *model.User {
	return &model.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		UserName:  req.Email,
		Email:     req.Email,
		Password:  req.Password,
	}
}

type UpdateUserRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	UserName  string `json:"user_name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
}

func (req *UpdateUserRequest) ToUser() *model.User {
	return &model.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		UserName:  req.UserName,
		Email:     req.Email,
		Role:      req.Role,
	}
}
