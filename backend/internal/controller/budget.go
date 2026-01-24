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
	
	var req dto.CreateBudgetRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	budget  := req.ToBudget()
	budget.UserID = &uid

	if err := bc.budgetService.Create(ctx, budget); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create budget")
		return
	}
	helper.SuccessResponse(ctx, http.StatusCreated, "Budget created successfully", nil)
}

func (bc *BudgetController) List(ctx *gin.Context) {
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

	familyId := ctx.Param("family_id")
    if familyId == "" {
        helper.ErrorResponse(ctx, http.StatusBadRequest, "family_id is required")
        return
    }
    familyID := uuid.MustParse(familyId)

	budgets, err := bc.budgetService.List(ctx, &familyID, &uid)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to get budgets")
		return
	}
	helper.SuccessResponse(ctx, http.StatusOK, "Budgets retrieved successfully", budgets)
}