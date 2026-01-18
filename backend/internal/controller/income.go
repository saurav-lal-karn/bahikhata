package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

func (ctrl *IncomeController) CreateIncome(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid user ID format in context")
		return
	}
	
	var incomeDTO dto.IncomeDTO
	if err := c.ShouldBindJSON(&incomeDTO); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := ctrl.svc.CreateIncome(c, &incomeDTO, uid); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Income created successfully", nil)
}

func (ctrl *IncomeController) GetIncomeById(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Income retrieved successfully", nil)
}

func (ctrl *IncomeController) ListIncomes(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid user ID format in context")
		return
	}
	
	familyID := c.Param("familyId")
	if familyID == "" {
		helper.ErrorResponse(c, http.StatusBadRequest, "Family ID is required")
		return
	}
	
	fid, err := uuid.Parse(familyID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid family ID format in context")
		return
	}
	
	incomes, err := ctrl.svc.ListIncomes(c, fid, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Incomes retrieved successfully", incomes)
}

func (ctrl *IncomeController) UpdateIncome(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Income updated successfully", nil)
}

func (ctrl *IncomeController) DeleteIncome(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Income deleted successfully", nil)
}

func (ctrl *IncomeController) GetIncomeStats(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Income stats retrieved successfully", nil)
}
