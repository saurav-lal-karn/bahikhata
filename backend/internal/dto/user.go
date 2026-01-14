package dto

import (
	"time"

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
	Country   string    `json:"country"`
	AvatarUrl string    `json:"avatar_url"`
	Theme     string    `json:"theme"`
	Locale      string    `json:"locale"`
	PhoneNumber string    `json:"phone_number"`
	Street      string    `json:"street"`
	City        string    `json:"city"`
	State       string    `json:"state"`
	PostalCode  string    `json:"postal_code"`
	CreatedAt   time.Time `json:"created_at"`
	Family FamilyResponse `json:"family"`
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
	UserType    string `json:"user_type"` // Example if role is user_type
	Role        string `json:"role"`
	Country     string `json:"country"`
	PhoneNumber string `json:"phone_number"`
	AvatarUrl   string `json:"avatar_url"`
	Theme       string `json:"theme"`
	Locale      string `json:"locale"`
	Street      string `json:"street"`
	City        string `json:"city"`
	State       string `json:"state"`
	PostalCode  string `json:"postal_code"`
}

func (req *UpdateUserRequest) ToUser() *model.User {
	return &model.User{
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		UserName:    req.UserName,
		Email:       req.Email,
		Role:        req.Role, // Note: updating role might be restricted in service layer usually
		Country:     req.Country,
		PhoneNumber: req.PhoneNumber,
		AvatarUrl:   req.AvatarUrl,
		Theme:       req.Theme,
		Locale:      req.Locale,
		Street:      req.Street,
		City:        req.City,
		State:       req.State,
		PostalCode:  req.PostalCode,
	}
}
