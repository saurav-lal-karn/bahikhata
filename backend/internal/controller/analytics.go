package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type AnalyticsController struct {
	svc service.AnalyticsService
}

func NewAnalyticsController(svc service.AnalyticsService) *AnalyticsController {
	return &AnalyticsController{svc: svc}
}

func (ctrl *AnalyticsController) GetDashboardSummary(c *gin.Context) {
	familyID, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	resp, err := ctrl.svc.GetDashboardSummary(c, familyID, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch dashboard summary")
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Dashboard summary retrieved successfully", resp)
}

func (ctrl *AnalyticsController) GetReportData(c *gin.Context) {
	familyID, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	resp, err := ctrl.svc.GetReportData(c, familyID, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch report data")
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Report data retrieved successfully", resp)
}
