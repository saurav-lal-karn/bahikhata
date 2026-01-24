package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type FamilyMemberController struct {
	svc service.FamilyMemberService
}

func NewFamilyMemberController(svc service.FamilyMemberService) FamilyMemberController {
	return FamilyMemberController{svc: svc}
}

func (ctrl *FamilyMemberController) Create(c *gin.Context) {
	var req dto.CreateFamilyMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	familyMember := req.ToFamilyMember()

	if err := ctrl.svc.Create(c.Request.Context(), familyMember); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyMemberResponse := dto.CreateFamilyMemberResponse{
		ID: familyMember.ID,
	}

	helper.SuccessResponse(c, http.StatusCreated, "Family member created successfully", familyMemberResponse)
}

func (ctrl *FamilyMemberController) List(c *gin.Context) {
	familyId := c.Param("family_id")
	familyMembers, err := ctrl.svc.GetByFamilyID(c.Request.Context(), familyId)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyMemberResponses := make([]dto.UserResponse, len(familyMembers))
	for i, familyMember := range familyMembers {
		familyMemberResponses[i] = dto.UserResponse{
			ID:   familyMember.ID,
			FirstName: familyMember.FirstName,
			LastName: familyMember.LastName,
			Email: familyMember.Email,
			Role: familyMember.Role,
			AvatarUrl: familyMember.AvatarUrl,
			CreatedAt: familyMember.CreatedAt,
		}
	}

	helper.SuccessResponse(c, http.StatusOK, "Family members listed successfully", familyMemberResponses)
}

func (ctrl *FamilyMemberController) Invite(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid user ID format in context")
		return
	}

	var req dto.InviteMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	if err := ctrl.svc.Invite(c.Request.Context(), req, uid); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Member invited successfully", nil)
}