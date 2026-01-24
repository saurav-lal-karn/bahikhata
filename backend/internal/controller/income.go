package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type IncomeController struct {
	svc service.IncomeService
}

func NewIncomeController(svc service.IncomeService) *IncomeController {
	return &IncomeController{svc: svc}
}

func (ctrl *IncomeController) Create(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
	
	var incomeDTO dto.IncomeDTO
	if err := c.ShouldBindJSON(&incomeDTO); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	income, err := ctrl.svc.Create(c, &incomeDTO, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	helper.SuccessResponse(c, http.StatusCreated, "Income created successfully", income)
}

func (ctrl *IncomeController) List(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
	
	familyID, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	
	incomes, err := ctrl.svc.List(c, familyID, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Incomes retrieved successfully", incomes)
}

func (ctrl *IncomeController) GetByID(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	
	income, err := ctrl.svc.GetByID(c, id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Income retrieved successfully", income)
}

func (ctrl *IncomeController) Update(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	
	var incomeDTO dto.IncomeDTO
	if err := c.ShouldBindJSON(&incomeDTO); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
	
	income, err := ctrl.svc.Update(c, id, &incomeDTO, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Income updated successfully", income)
}

func (ctrl *IncomeController) Delete(c *gin.Context) {
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	
	if err := ctrl.svc.Delete(c, id); err != nil {
		handleServiceError(c, err)
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Income deleted successfully", nil)
}

func (ctrl *IncomeController) GetStats(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Income stats retrieved successfully", nil)
}
