package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

func (c *GoalController) CreateGoal(ctx *gin.Context) {
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

	var req dto.CreateGoalRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	goal, err := req.ToGoal()
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}
	goal.UserID = &uid

	err = c.goalService.CreateGoal(ctx.Request.Context(), goal)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create goal"})
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Goal created successfully", nil)
}

func(c *GoalController) GetGoals(ctx *gin.Context) {
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

	goals, err := c.goalService.GetGoals(ctx.Request.Context(), familyID, uid)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get goals"})
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Goals retrieved successfully", goals)
}