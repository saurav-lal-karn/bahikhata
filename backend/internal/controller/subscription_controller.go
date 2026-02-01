package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type SubscriptionController struct {
	service service.SubscriptionService
}

func NewSubscriptionController(service service.SubscriptionService) *SubscriptionController {
	return &SubscriptionController{service: service}
}

func (c *SubscriptionController) CreateSubscription(ctx *gin.Context) {
	var req dto.CreateSubscriptionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	familyID, exists := ctx.Get("family_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Family ID not found in context"})
		return
	}
	req.FamilyID = familyID.(uuid.UUID)

	res, err := c.service.CreateSubscription(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, res)
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
	
	subs, err := c.service.GetSubscriptions(familyID)
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

	res, err := c.service.GetSubscription(id)
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

	if err := c.service.DeleteSubscription(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Subscription deleted"})
}
