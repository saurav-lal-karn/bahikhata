package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type BudgetController struct {
	budgetService service.BudgetService
}

func NewBudgetController(budgetService service.BudgetService) *BudgetController {
	return &BudgetController{budgetService: budgetService}
}

func (bc *BudgetController) Create(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}
	
	var req dto.CreateBudgetRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	budget, err := bc.budgetService.Create(ctx, &req, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}
	helper.SuccessResponse(ctx, http.StatusCreated, "Budget created successfully", budget)
}

func (bc *BudgetController) Update(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.UpdateBudgetRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	budget, err := bc.budgetService.Update(ctx, id, &req, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}
	helper.SuccessResponse(ctx, http.StatusOK, "Budget updated successfully", budget)
}

func (bc *BudgetController) Delete(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := bc.budgetService.Delete(ctx, id); err != nil {
		handleServiceError(ctx, err)
		return
	}
	helper.SuccessResponse(ctx, http.StatusOK, "Budget deleted successfully", nil)
}

func (bc *BudgetController) List(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	familyID, err := parseUUIDParam(ctx, "family_id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	budgets, err := bc.budgetService.List(ctx, &familyID, &uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}
	helper.SuccessResponse(ctx, http.StatusOK, "Budgets retrieved successfully", budgets)
}

func (bc *BudgetController) GetPeriods(ctx *gin.Context) {
	budgetID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	periods, err := bc.budgetService.GetPeriods(ctx, budgetID)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Budget periods retrieved successfully", periods)
}

func (bc *BudgetController) GetAlerts(ctx *gin.Context) {
	var familyID *uuid.UUID
	fid, err := parseUUIDQuery(ctx, "family_id")
	if err != nil {
		familyID = &fid
	}

	alerts, err := bc.budgetService.GetAlerts(ctx, familyID)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Budget alerts retrieved successfully", alerts)
}

func (bc *BudgetController) AcknowledgeAlert(ctx *gin.Context) {
	alertID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := bc.budgetService.AcknowledgeAlert(ctx, alertID); err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Alert acknowledged successfully", nil)
}