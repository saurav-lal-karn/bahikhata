package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type GoalController struct {
	goalService service.GoalService
}

func NewGoalController(goalService service.GoalService) *GoalController {
	return &GoalController{goalService: goalService}
}

func (c *GoalController) Create(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	var req dto.CreateGoalRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	goal, err := c.goalService.Create(ctx.Request.Context(), &req, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Goal created successfully", goal)
}

func (c *GoalController) List(ctx *gin.Context) {
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

	goals, err := c.goalService.List(ctx.Request.Context(), familyID, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Goals retrieved successfully", goals)
}

func (c *GoalController) AddContribution(ctx *gin.Context) {
	goalID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.AddGoalContributionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	contribution := req.ToModel(goalID)
	if err := c.goalService.CreateContribution(ctx.Request.Context(), contribution); err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Contribution added successfully", contribution)
}

func (c *GoalController) ListContributions(ctx *gin.Context) {
	goalID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	contributions, err := c.goalService.ListContributions(ctx.Request.Context(), goalID)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Contributions fetched successfully", contributions)
}

func (c *GoalController) Update(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	goalID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.UpdateGoalRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	goal, err := c.goalService.Update(ctx.Request.Context(), goalID, &req, uid)
	if err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Goal updated successfully", goal)
}

func (c *GoalController) Delete(ctx *gin.Context) {
	goalID, err := parseUUIDParam(ctx, "id")
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := c.goalService.Delete(ctx.Request.Context(), goalID); err != nil {
		handleServiceError(ctx, err)
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Goal deleted successfully", nil)
}
