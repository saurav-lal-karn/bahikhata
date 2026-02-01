package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type OrganizationController struct {
	service service.OrganizationService
}

func NewOrganizationController(service service.OrganizationService) *OrganizationController {
	return &OrganizationController{service: service}
}

func (ctrl *OrganizationController) CreateTag(c *gin.Context) {
	var req dto.CreateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.service.CreateTag(c.Request.Context(), req)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Tag created successfully", resp)
}

func (ctrl *OrganizationController) GetTags(c *gin.Context) {
	familyIDStr := c.Param("family_id")
	familyID, err := uuid.Parse(familyIDStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid family ID")
		return
	}

	resp, err := ctrl.service.GetTags(c.Request.Context(), familyID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Tags retrieved successfully", resp)
}

func (ctrl *OrganizationController) CreateProject(c *gin.Context) {
	var req dto.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.service.CreateProject(c.Request.Context(), req)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Project created successfully", resp)
}

func (ctrl *OrganizationController) GetProjects(c *gin.Context) {
	familyIDStr := c.Param("family_id")
	familyID, err := uuid.Parse(familyIDStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid family ID")
		return
	}

	resp, err := ctrl.service.GetProjects(c.Request.Context(), familyID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Projects retrieved successfully", resp)
}
