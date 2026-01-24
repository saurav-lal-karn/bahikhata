package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type DebtController struct {
	service service.DebtService
}

func NewDebtController(service service.DebtService) *DebtController {
	return &DebtController{service: service}
}

func (c *DebtController) Create(ctx *gin.Context) {
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

	var req dto.CreateDebtRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	debt, err := req.ToModel()
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid due date format")
		return
	}
	debt.UserID = &uid

	if err := c.service.Create(ctx, debt); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create debt")
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Debt created successfully", debt)
}

func (c *DebtController) List(ctx *gin.Context) {
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

	var familyID *uuid.UUID
	familyIdParam := ctx.Query("family_id")
	if familyIdParam != "" {
		if fid, err := uuid.Parse(familyIdParam); err == nil {
			familyID = &fid
		}
	}

	debts, err := c.service.List(ctx, familyID, &uid)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch debts")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Debts fetched successfully", debts)
}

func (c *DebtController) Delete(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := c.service.Delete(ctx, id); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete debt")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Debt deleted successfully", nil)
}
