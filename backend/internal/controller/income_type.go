package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type IncomeTypeController struct {
	svc service.IncomeTypeService
}

func NewIncomeTypeController(svc service.IncomeTypeService) IncomeTypeController {
	return IncomeTypeController{svc: svc}
}

func (c *IncomeTypeController) CreateIncomeType(ctx *gin.Context) {
	// return c.svc.CreateIncomeType(ctx, incomeType)
	helper.SuccessResponse(ctx, 200, "Income type created successfully", nil)
}

func (c *IncomeTypeController) GetIncomeTypes(ctx *gin.Context) {
	familyId := ctx.Param("family_id")
	if familyId == "" {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "family_id is required")
		return
	}

	familyUid, err := uuid.Parse(familyId)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid family ID format")
		return
	}

	userId, exists := ctx.Get("userId")
	if !exists {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Invalid user ID format in context")
		return
	}

	incomeTypes, err := c.svc.GetIncomeTypes(ctx, familyUid, uid)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch income types")
		return
	}

	helper.SuccessResponse(ctx, 200, "Income types fetched successfully", incomeTypes)
}