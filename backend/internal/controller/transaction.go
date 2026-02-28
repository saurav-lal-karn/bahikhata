package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

// TransactionController handles unified transaction requests.
type TransactionController struct {
	svc service.TransactionService
}

// NewTransactionController creates a new TransactionController.
func NewTransactionController(svc service.TransactionService) *TransactionController {
	return &TransactionController{svc: svc}
}

func (ctrl *TransactionController) Create(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	var req dto.CreateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	resp, err := ctrl.svc.Create(c, &req, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Transaction created successfully", resp)
}

func (ctrl *TransactionController) GetByID(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, _ := getUserIDFromContext(c)

	resp, err := ctrl.svc.GetByID(c, id, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transaction retrieved successfully", resp)
}

func (ctrl *TransactionController) List(c *gin.Context) {
	familyID, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, _ := getUserIDFromContext(c)

	filters := make(map[string]interface{})
	if type_ := c.Query("type"); type_ != "" {
		filters["type"] = type_
	}
	if walletID := c.Query("wallet_id"); walletID != "" {
		filters["wallet_id"] = walletID
	}
	if categoryID := c.Query("category_id"); categoryID != "" {
		filters["category_id"] = categoryID
	}
	if projectID := c.Query("project_id"); projectID != "" {
		filters["project_id"] = projectID
	}
	if contactID := c.Query("contact_id"); contactID != "" {
		filters["contact_id"] = contactID
	}
	if locationID := c.Query("location_id"); locationID != "" {
		filters["location_id"] = locationID
	}
	if search := c.Query("search"); search != "" {
		filters["search"] = search
	}
	if page := c.Query("page"); page != "" {
		if p, err := strconv.Atoi(page); err == nil {
			filters["page"] = p
		}
	}
	if pageSize := c.Query("page_size"); pageSize != "" {
		if ps, err := strconv.Atoi(pageSize); err == nil {
			filters["page_size"] = ps
		}
	}

	resp, err := ctrl.svc.List(c, familyID, uid, filters)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transactions retrieved successfully", resp)
}

func (ctrl *TransactionController) Update(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, _ := getUserIDFromContext(c)

	var req dto.UpdateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	resp, err := ctrl.svc.Update(c, id, &req, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transaction updated successfully", resp)
}

func (ctrl *TransactionController) Delete(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, _ := getUserIDFromContext(c)

	if err := ctrl.svc.Delete(c, id, uid); err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transaction deleted successfully", nil)
}

func (ctrl *TransactionController) GetStats(c *gin.Context) {
	familyID, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, _ := getUserIDFromContext(c)

	filters := make(map[string]interface{})
	if type_ := c.Query("type"); type_ != "" {
		filters["type"] = type_
	}

	resp, err := ctrl.svc.GetStats(c, familyID, uid, filters)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Transaction stats retrieved successfully", resp)
}

func (ctrl *TransactionController) BulkImport(c *gin.Context) {
	familyID, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, _ := getUserIDFromContext(c)

	var req dto.BulkImportTransactionsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	resp, err := ctrl.svc.BulkImport(c, &req, familyID, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Transactions imported successfully", resp)
}
