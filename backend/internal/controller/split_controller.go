package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type SplitController struct {
	service service.SplitService
}

func NewSplitController(service service.SplitService) *SplitController {
	return &SplitController{service: service}
}

func (c *SplitController) CreateSplit(ctx *gin.Context) {
	var req dto.CreateSplitRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := c.service.CreateSplit(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, res)
}

func (c *SplitController) GetSplit(ctx *gin.Context) {
	txID, err := uuid.Parse(ctx.Param("tx_id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Transaction ID"})
		return
	}

	res, err := c.service.GetSplitByTransactionID(txID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Split not found"})
		return
	}

	ctx.JSON(http.StatusOK, res)
}

func (c *SplitController) CreateSettlement(ctx *gin.Context) {
	var req dto.CreateSplitSettlementRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.service.CreateSettlement(req); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Settlement created successfully"})
}
