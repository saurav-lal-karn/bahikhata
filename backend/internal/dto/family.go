package dto

import "github.com/sauravkarn541/bahikhata/internal/model"

type CreateFamilyRequest struct {
	Name string `json:"name"`
}

type FamilyResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type InviteMemberRequest struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Role      string `json:"role" binding:"required"`
}

func (req *CreateFamilyRequest) ToFamily() *model.Family {
	return &model.Family{
		Name: req.Name,
	}
}
