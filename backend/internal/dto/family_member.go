package dto

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateFamilyMemberRequest struct {
	FamilyID uuid.UUID `json:"family_id" binding:"required"`
	UserID   uuid.UUID `json:"user_id" binding:"required"`
	Role     string    `json:"role" binding:"required"`
}

func (req *CreateFamilyMemberRequest) ToFamilyMember() *model.FamilyMember {
	return &model.FamilyMember{
		FamilyID: req.FamilyID,
		UserID:   req.UserID,
		Role:     req.Role,
	}
}

type CreateFamilyMemberResponse struct {
	ID uuid.UUID `json:"id"`
}

type InviteMemberRequest struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Role      string `json:"role" binding:"required"`
	FamilyID  uuid.UUID `json:"familyId" binding:"required"`
}