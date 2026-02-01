package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

// TransactionCategoryController handles transaction category requests.
type TransactionCategoryController struct {
	svc service.TransactionCategoryService
}

// NewTransactionCategoryController creates a new TransactionCategoryController.
func NewTransactionCategoryController(svc service.TransactionCategoryService) *TransactionCategoryController {
	return &TransactionCategoryController{svc: svc}
}

func (ctrl *TransactionCategoryController) Create(c *gin.Context) {
	var req dto.CreateTransactionCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	resp, err := ctrl.svc.Create(c, &req)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Transaction category created successfully", resp)
}

func (ctrl *TransactionCategoryController) GetByID(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ctrl.svc.GetByID(c, id)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transaction category retrieved successfully", resp)
}

func (ctrl *TransactionCategoryController) List(c *gin.Context) {
	familyID, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	includeSystem := c.Query("include_system") == "true"
	type_ := c.Query("type")

	resp, err := ctrl.svc.List(c, familyID, includeSystem, type_)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transaction categories retrieved successfully", resp)
}

func (ctrl *TransactionCategoryController) Update(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.UpdateTransactionCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	resp, err := ctrl.svc.Update(c, id, &req)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transaction category updated successfully", resp)
}

func (ctrl *TransactionCategoryController) Delete(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := ctrl.svc.Delete(c, id); err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transaction category deleted successfully", nil)
}
