package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type LocationController struct {
	locationService service.LocationService
}

func NewLocationController(locationService service.LocationService) *LocationController {
	return &LocationController{locationService: locationService}
}

func (ctrl *LocationController) Create(c *gin.Context) {
	var req dto.CreateLocationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.locationService.Create(c.Request.Context(), req)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Location created successfully", resp)
}

func (ctrl *LocationController) List(c *gin.Context) {
	familyIDStr := c.Param("family_id")
	familyID, err := uuid.Parse(familyIDStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid family ID")
		return
	}

	resp, err := ctrl.locationService.List(c.Request.Context(), familyID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Locations retrieved successfully", resp)
}

func (ctrl *LocationController) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid location ID")
		return
	}

	resp, err := ctrl.locationService.GetByID(c.Request.Context(), id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Location retrieved successfully", resp)
}

func (ctrl *LocationController) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid location ID")
		return
	}

	var req dto.UpdateLocationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.locationService.Update(c.Request.Context(), id, req)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Location updated successfully", resp)
}

func (ctrl *LocationController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid location ID")
		return
	}

	if err := ctrl.locationService.Delete(c.Request.Context(), id); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Location deleted successfully", nil)
}
