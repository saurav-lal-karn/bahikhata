package dto

import "github.com/sauravkarn541/bahikhata/internal/model"

type CreateFamilyMemberRequest struct {
	FamilyID string `json:"family_id" binding:"required"`
	UserID   string `json:"user_id" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

func (req *CreateFamilyMemberRequest) ToFamilyMember() *model.FamilyMember {
	return &model.FamilyMember{
		FamilyID: req.FamilyID,
		UserID:   req.UserID,
		Role:     req.Role,
	}
}

type CreateFamilyMemberResponse struct {
	ID string `json:"id"`
}
