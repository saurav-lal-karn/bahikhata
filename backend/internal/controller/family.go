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
	svc service.FamilyService
}

func NewFamilyController(svc service.FamilyService) FamilyController {
	return FamilyController{svc: svc}
}

func (ctrl *FamilyController) CreateFamily(c *gin.Context) {
	var req dto.CreateFamilyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	family := req.ToFamily()

	if err := ctrl.svc.CreateFamily(c.Request.Context(), family); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyResponse := dto.FamilyResponse{
		ID:   family.ID.String(),
		Name: family.Name,
	}

	helper.SuccessResponse(c, http.StatusCreated, "Family created successfully", familyResponse)
}

func (ctrl *FamilyController) ListFamilies(c *gin.Context) {
	families, err := ctrl.svc.ListFamilies(c.Request.Context())
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyResponses := make([]dto.FamilyResponse, len(families))
	for i, family := range families {
		familyResponses[i] = dto.FamilyResponse{
			ID:   family.ID.String(),
			Name: family.Name,
		}
	}

	helper.SuccessResponse(c, http.StatusOK, "Families listed successfully", familyResponses)
}

func (ctrl *FamilyController) GetFamily(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	family, err := ctrl.svc.GetFamilyById(c.Request.Context(), parsedId)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyResponse := dto.FamilyResponse{
		ID:   family.ID.String(),
		Name: family.Name,
	}

	helper.SuccessResponse(c, http.StatusOK, "Family fetched successfully", familyResponse)
}

func (ctrl *FamilyController) UpdateFamily(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var req dto.CreateFamilyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	family := req.ToFamily()
	family.ID = parsedId

	if err := ctrl.svc.UpdateFamily(c.Request.Context(), family); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	familyResponse := dto.FamilyResponse{
		ID:   family.ID.String(),
		Name: family.Name,
	}

	helper.SuccessResponse(c, http.StatusOK, "Family updated successfully", familyResponse)
}

func (ctrl *FamilyController) DeleteFamily(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := ctrl.svc.DeleteFamily(c.Request.Context(), parsedId); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Family deleted successfully", nil)
}
