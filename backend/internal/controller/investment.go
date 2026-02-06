package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type InvestmentController struct {
	investmentService service.InvestmentService
}

func NewInvestmentController(investmentService service.InvestmentService) *InvestmentController {
	return &InvestmentController{investmentService: investmentService}
}

func (c *InvestmentController) Create(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	var req dto.CreateInvestmentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	investment, err := c.investmentService.Create(ctx, &req, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Investment created successfully", investment)
}

func (c *InvestmentController) List(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	familyID, err := parseUUIDQuery(ctx, "family_id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	investments, err := c.investmentService.List(ctx, &familyID, &uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Investments fetched successfully", investments)
}

func (c *InvestmentController) Delete(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := c.investmentService.Delete(ctx, id); err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Investment deleted successfully", nil)
}

func (c *InvestmentController) Update(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.UpdateInvestmentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	investment, err := c.investmentService.Update(ctx, id, &req, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Investment updated successfully", investment)
}

func (c *InvestmentController) GetByID(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	investment, err := c.investmentService.GetByID(ctx, id)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Investment fetched successfully", investment)
}

func (c *InvestmentController) AddTransaction(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.AddInvestmentTransactionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	transaction, err := c.investmentService.CreateTransaction(ctx, id, &req)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Transaction added successfully", transaction)
}

func (c *InvestmentController) ListTransactions(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	transactions, err := c.investmentService.ListTransactions(ctx, id)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Transactions fetched successfully", transactions)
}

func (c *InvestmentController) AddValuation(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.CreateInvestmentValuationRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	valuation , err := c.investmentService.CreateValuation(ctx, id, &req)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Valuation added successfully", valuation)
}

func (c *InvestmentController) ListValuations(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	valuations, err := c.investmentService.ListValuations(ctx, id)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Valuations fetched successfully", valuations)
}
