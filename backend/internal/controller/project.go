package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type ProjectController struct {
	projectService service.ProjectService
}

func NewProjectController(projectService service.ProjectService) *ProjectController {
	return &ProjectController{projectService: projectService}
}

func (ctrl *ProjectController) Create(c *gin.Context) {
	var req dto.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.projectService.Create(c.Request.Context(), req)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Project created successfully", resp)
}

func (ctrl *ProjectController) List(c *gin.Context) {
	familyIDStr := c.Param("family_id")
	familyID, err := uuid.Parse(familyIDStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid family ID")
		return
	}

	resp, err := ctrl.projectService.List(c.Request.Context(), familyID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Projects retrieved successfully", resp)
}

func (ctrl *ProjectController) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	var req dto.UpdateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.projectService.Update(c.Request.Context(), id, req)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Project updated successfully", resp)
}

func (ctrl *ProjectController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	if err := ctrl.projectService.Delete(c.Request.Context(), id); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Project deleted successfully", nil)
}

func (ctrl *ProjectController) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	resp, err := ctrl.projectService.GetByID(c.Request.Context(), id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Project retrieved successfully", resp)
}
