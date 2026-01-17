package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type WalletController struct {
	svc service.WalletService
}

func NewWalletController(svc service.WalletService) WalletController {
	return WalletController{svc: svc}
}

func (ctrl *WalletController) CreateWallet(c *gin.Context) {
	var req dto.CreateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Wallet created successfully", req)
}