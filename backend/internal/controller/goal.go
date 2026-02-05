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

	familyId := ctx.Query("family_id")
	if familyId == "" {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "family_id is required")
		return
	}
	familyID, err := uuid.Parse(familyId)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid family_id format")
		return
	}

	goals, err := c.goalService.List(ctx.Request.Context(), familyID, uid)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get goals"})
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Goals retrieved successfully", goals)
}

func (c *GoalController) AddContribution(ctx *gin.Context) {
	idParam := ctx.Param("id")
	goalID, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var req dto.AddGoalContributionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	contribution := req.ToModel(goalID)
	if err := c.goalService.CreateContribution(ctx.Request.Context(), contribution); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to add contribution")
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Contribution added successfully", contribution)
}

func (c *GoalController) ListContributions(ctx *gin.Context) {
	idParam := ctx.Param("id")
	goalID, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	contributions, err := c.goalService.ListContributions(ctx.Request.Context(), goalID)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to fetch contributions")
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

	idParam := ctx.Param("id")
	goalID, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var req dto.UpdateGoalRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	goal, err := c.goalService.Update(ctx.Request.Context(), goalID, &req, uid)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to update goal")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Goal updated successfully", goal)
}

func (c *GoalController) Delete(ctx *gin.Context) {
	_, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	idParam := ctx.Param("id")
	goalID, err := uuid.Parse(idParam)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := c.goalService.Delete(ctx.Request.Context(), goalID); err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to delete goal")
		return
	}

	helper.SuccessResponse(ctx, http.StatusOK, "Goal deleted successfully", nil)
}
