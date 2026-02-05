package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type SubscriptionController struct {
	service service.SubscriptionService
}

func NewSubscriptionController(service service.SubscriptionService) *SubscriptionController {
	return &SubscriptionController{service: service}
}

func (c *SubscriptionController) CreateSubscription(ctx *gin.Context) {
	uid, err := getUserIDFromContext(ctx)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	var req dto.CreateSubscriptionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(ctx, http.StatusBadRequest, err.Error())
		return
	}

	res, err := c.service.CreateSubscription(ctx, req, uid)
	if err != nil {
		helper.ErrorResponse(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(ctx, http.StatusCreated, "Subscription created successfully", res)
}

func (c *SubscriptionController) GetSubscriptions(ctx *gin.Context) {
	var familyID uuid.UUID
	var err error

	// Try to get from query param first
	queryFamilyID := ctx.Query("family_id")
	if queryFamilyID != "" {
		familyID, err = uuid.Parse(queryFamilyID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid family_id format"})
			return
		}
	} else {
		// Fallback to context
		ctxFamilyID, exists := ctx.Get("family_id")
		if !exists {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Family ID not found in context"})
			return
		}
		familyID = ctxFamilyID.(uuid.UUID)
	}
	
	subs, err := c.service.GetSubscriptions(ctx, familyID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, subs)
}

func (c *SubscriptionController) GetSubscription(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	res, err := c.service.GetSubscription(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Subscription not found"})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c *SubscriptionController) DeleteSubscription(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.service.DeleteSubscription(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Subscription deleted"})
}

func (c *SubscriptionController) UpdateSubscription(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req dto.UpdateSubscriptionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := c.service.UpdateSubscription(ctx, id, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, res)
}
