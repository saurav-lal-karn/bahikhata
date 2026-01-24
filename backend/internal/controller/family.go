package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type FamilyController struct {
	svc      service.FamilyService
	emailSvc service.EmailService
}

func NewFamilyController(svc service.FamilyService, emailSvc service.EmailService) FamilyController {
	return FamilyController{svc: svc, emailSvc: emailSvc}
}

func (ctrl *FamilyController) Create(c *gin.Context) {
	var req dto.CreateFamilyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	family := req.ToFamily()

	if err := ctrl.svc.Create(c.Request.Context(), family); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyResponse := dto.ToFamilyResponse(family)

	helper.SuccessResponse(c, http.StatusCreated, "Family created successfully", familyResponse)
}

func (ctrl *FamilyController) List(c *gin.Context) {
	families, err := ctrl.svc.List(c.Request.Context())
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyResponses := make([]dto.FamilyResponse, len(families))
	for i, family := range families {
		familyResponses[i] = dto.ToFamilyResponse(&family)
	}

	helper.SuccessResponse(c, http.StatusOK, "Families listed successfully", familyResponses)
}

func (ctrl *FamilyController) GetByID(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	family, err := ctrl.svc.GetByID(c.Request.Context(), parsedId)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyResponse := dto.ToFamilyResponse(family)

	helper.SuccessResponse(c, http.StatusOK, "Family fetched successfully", familyResponse)
}

func (ctrl *FamilyController) Update(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var req dto.UpdateFamilySettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	family := req.ToFamily()
	family.ID = parsedId

	if err := ctrl.svc.Update(c.Request.Context(), family); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyResponse := dto.ToFamilyResponse(family)

	helper.SuccessResponse(c, http.StatusOK, "Family updated successfully", familyResponse)
}

func (ctrl *FamilyController) Delete(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := ctrl.svc.Delete(c.Request.Context(), parsedId); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Family deleted successfully", nil)
}

func (ctrl *FamilyController) Invite(c *gin.Context) {
	var req dto.InviteMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	// Generate invitation link (for now, just a placeholder)
	inviteLink := "https://bahikhata.com/register?email=" + req.Email

	// Note: This implementation doesn't generate a password like the family_member service does
	// Consider using the family_member service instead for consistency
	// Send invitation email (currently logs it) - using empty password as placeholder
	if err := ctrl.emailSvc.SendInvitationEmail(req.Email, req.FirstName, req.Role, "", inviteLink); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to send invitation")
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Invitation sent successfully", nil)
}

func (ctrl *FamilyController) GetStats(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	stats, err := ctrl.svc.GetStats(c.Request.Context(), parsedId)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Family stats fetched successfully", stats)
}

