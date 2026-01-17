package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type ExpenseController struct {
    service service.ExpenseService
}

func NewExpenseController(service service.ExpenseService) *ExpenseController {
    return &ExpenseController{service: service}
}

func (c *ExpenseController) CreateExpense(ctx *gin.Context) {
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
    
    var req dto.CreateExpenseRequest
    if err := ctx.ShouldBindJSON(&req); err != nil {
        helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
        return
    }

    // Conditional validation
    if req.IsCustomCategory {
        if req.CustomCategoryName == "" {
            helper.ErrorResponse(ctx, http.StatusBadRequest, "custom_category_name is required when is_custom_category is true")
            return
        }
    } else {
        if req.CategoryID == "" {
            helper.ErrorResponse(ctx, http.StatusBadRequest, "category_id is required when is_custom_category is false")
            return
        }
    }

    if req.IsCustomPaymentMethod {
        if req.CustomPaymentMethodName == "" {
            helper.ErrorResponse(ctx, http.StatusBadRequest, "custom_payment_method_name is required when is_custom_payment_method is true")
            return
        }
    } else {
        if req.PaymentMethodID == "" {
            helper.ErrorResponse(ctx, http.StatusBadRequest, "payment_method_id is required when is_custom_payment_method is false")
            return
        }
    }

    err = c.service.CreateExpense(ctx.Request.Context(), &req, uid)
    if err != nil {
        helper.ErrorResponse(ctx, http.StatusInternalServerError, err.Error())
        return
    }

    helper.SuccessResponse(ctx, http.StatusCreated, "Expense created successfully", req)
}

func (c *ExpenseController) GetExpenses(ctx *gin.Context) {
    familyId := ctx.Param("family_id")
    if familyId == "" {
        helper.ErrorResponse(ctx, http.StatusBadRequest, "family_id is required")
        return
    }
    familyID := uuid.MustParse(familyId)

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

    expenses, err := c.service.ListExpenses(ctx.Request.Context(), familyID, uid)
    if err != nil {
        helper.ErrorResponse(ctx, http.StatusInternalServerError, err.Error())
        return
    }
    helper.SuccessResponse(ctx, http.StatusOK, "Expenses fetched successfully", expenses)
}

func (c *ExpenseController) GetExpenseStats(ctx *gin.Context) {
    familyId := ctx.Param("family_id")
    if familyId == "" {
        helper.ErrorResponse(ctx, http.StatusBadRequest, "family_id is required")
        return
    }
    familyID := uuid.MustParse(familyId)

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

    stats, err := c.service.GetExpenseStats(ctx.Request.Context(), familyID, uid)
    if err != nil {
        helper.ErrorResponse(ctx, http.StatusInternalServerError, err.Error())
        return
    }
    helper.SuccessResponse(ctx, http.StatusOK, "Expense stats fetched successfully", stats)
}