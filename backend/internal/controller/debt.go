package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type DebtController struct {
	debtService service.DebtService
}

func NewDebtController(debtService service.DebtService) *DebtController {
	return &DebtController{debtService: debtService}
}

func (c *DebtController) Create(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	var req dto.CreateDebtRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	debt, err := c.debtService.Create(ctx, &req, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Debt created successfully", debt)
}

func (c *DebtController) List(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	familyID, err := parseUUIDQuery(ctx, "family_id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	debts, err := c.debtService.List(ctx, &familyID, &uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Debts fetched successfully", debts)
}

func (c *DebtController) Delete(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := c.debtService.Delete(ctx, id); err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Debt deleted successfully", nil)
}

func (c *DebtController) GetByID(ctx *gin.Context) {
	id, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	debt, err := c.debtService.GetByID(ctx, id)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Debt fetched successfully", debt)
}

func (c *DebtController) Update(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	debtID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.UpdateDebtRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	debt, err := c.debtService.Update(ctx, debtID, &req, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Debt updated successfully", debt)
}

func (c *DebtController) AddRepayment(ctx *gin.Context) {
	debtID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.CreateDebtRepaymentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	repayment, err := c.debtService.CreateRepayment(ctx, debtID, &req)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Repayment added successfully", repayment)
}

func (c *DebtController) ListRepayments(ctx *gin.Context) {
	debtID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	repayments, err := c.debtService.ListRepayments(ctx, debtID)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Repayments fetched successfully", repayments)
}

func (c *DebtController) CreateSchedules(ctx *gin.Context) {
	debtID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req []*dto.CreateDebtScheduleRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	schedules, err := c.debtService.CreateSchedules(ctx, debtID, req)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to create schedules")
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Schedules created successfully", schedules)
}

func (c *DebtController) UpdateScheduleStatus(ctx *gin.Context) {
	scheduleID, err := parseUUIDParam(ctx, "schedule_id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.UpdateDebtScheduleStatusRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	debtSchedule, err := c.debtService.UpdateScheduleStatus(ctx, scheduleID, req.Status)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Schedule status updated successfully", debtSchedule)
}

func (c *DebtController) GetAmortizationSchedule(ctx *gin.Context) {
	idParam := ctx.Param("id")
	debtID, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	schedules, err := c.debtService.GetAmortizationSchedule(ctx, debtID)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch amortization schedule")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Amortization schedule fetched successfully", schedules)
}
