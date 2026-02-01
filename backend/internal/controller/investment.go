package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type InvestmentController struct {
	service service.InvestmentService
}

func NewInvestmentController(service service.InvestmentService) *InvestmentController {
	return &InvestmentController{service: service}
}

func (c *InvestmentController) Create(ctx *gin.Context) {
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

	var req dto.CreateInvestmentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	investment := req.ToModel()
	investment.UserID = &uid

	if err := c.service.Create(ctx, investment); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create investment")
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Investment created successfully", investment)
}

func (c *InvestmentController) List(ctx *gin.Context) {
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

	investments, err := c.service.List(ctx, familyID, &uid)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch investments")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Investments fetched successfully", investments)
}

func (c *InvestmentController) Delete(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := c.service.Delete(ctx, id); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete investment")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Investment deleted successfully", nil)
}

func (c *InvestmentController) AddTransaction(ctx *gin.Context) {
	idParam := ctx.Param("id")
	investmentID, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var req dto.AddInvestmentTransactionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	transaction := req.ToModel(investmentID)
	if err := c.service.CreateTransaction(ctx, transaction); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to add transaction")
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Transaction added successfully", transaction)
}

func (c *InvestmentController) ListTransactions(ctx *gin.Context) {
	idParam := ctx.Param("id")
	investmentID, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	transactions, err := c.service.ListTransactions(ctx, investmentID)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch transactions")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Transactions fetched successfully", transactions)
}
