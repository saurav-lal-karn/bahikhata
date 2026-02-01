package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type InsuranceController struct {
	service service.InsuranceService
}

func NewInsuranceController(service service.InsuranceService) *InsuranceController {
	return &InsuranceController{service: service}
}

func (c *InsuranceController) CreatePolicy(ctx *gin.Context) {
	var req dto.CreateInsurancePolicyRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	familyID, _ := ctx.Get("family_id")
	req.FamilyID = familyID.(uuid.UUID)

	res, err := c.service.CreatePolicy(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, res)
}

func (c *InsuranceController) GetPolicies(ctx *gin.Context) {
	familyID, _ := ctx.Get("family_id")
	policies, err := c.service.GetPolicies(familyID.(uuid.UUID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, policies)
}

func (c *InsuranceController) GetPolicy(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	res, err := c.service.GetPolicy(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Policy not found"})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c *InsuranceController) DeletePolicy(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := c.service.DeletePolicy(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Policy deleted"})
}
