package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
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

func (ctrl *FamilyMemberController) CreateFamilyMember(c *gin.Context) {
	var req dto.CreateFamilyMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	familyMember := req.ToFamilyMember()

	if err := ctrl.svc.CreateFamilyMember(c.Request.Context(), familyMember); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyMemberResponse := dto.CreateFamilyMemberResponse{
		ID: familyMember.ID,
	}

	helper.SuccessResponse(c, http.StatusCreated, "Family member created successfully", familyMemberResponse)
}

// func (ctrl *FamilyMemberController) ListFamilyMembers(c *gin.Context) {
// 	familyMembers, err := ctrl.svc.ListFamilyMembers(c.Request.Context())
// 	if err != nil {
// 		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
// 		return
// 	}

// 	familyMemberResponses := make([]dto.FamilyMemberResponse, len(familyMembers))
// 	for i, familyMember := range familyMembers {
// 		familyMemberResponses[i] = dto.FamilyMemberResponse{
// 			ID:   familyMember.ID.String(),
// 			Name: familyMember.Name,
// 		}
// 	}

// 	helper.SuccessResponse(c, http.StatusOK, "Family members listed successfully", familyMemberResponses)
// }
