package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type RecurringTransactionController struct {
	service service.RecurringTransactionService
}

func NewRecurringTransactionController(service service.RecurringTransactionService) *RecurringTransactionController {
	return &RecurringTransactionController{service: service}
}

func (c *RecurringTransactionController) Create(ctx *gin.Context) {
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

	var req dto.CreateRecurringTransactionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	rt, err := req.ToModel()
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid date format")
		return
	}
	rt.UserID = &uid

	if err := c.service.Create(ctx, rt); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create recurring transaction")
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Recurring transaction created successfully", rt)
}

func (c *RecurringTransactionController) GetAll(ctx *gin.Context) {
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

	rts, err := c.service.GetAll(ctx, familyID, &uid)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch recurring transactions")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Recurring transactions fetched successfully", rts)
}

func (c *RecurringTransactionController) Delete(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := c.service.Delete(ctx, id); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete recurring transaction")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Recurring transaction deleted successfully", nil)
}
