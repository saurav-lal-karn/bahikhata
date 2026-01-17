package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type WalletTransferController struct {
	svc service.WalletTransferService
}

func NewWalletTransferController(svc service.WalletTransferService) WalletTransferController {
	return WalletTransferController{svc: svc}
}

func (ctrl *WalletTransferController) CreateWalletTransfer(c *gin.Context) {
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

	var req dto.CreateWalletTransferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	walletTransfer, err := req.ToWalletTransfer()
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}
	walletTransfer.UserID = uid

	if err := ctrl.svc.CreateWalletTransfer(c, walletTransfer); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	helper.SuccessResponse(c, http.StatusCreated, "Wallet transfer created successfully", walletTransfer)
}

func (ctrl *WalletTransferController) ListWalletTransfers(c *gin.Context) {
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

	familyId := c.Param("family_id")
	fid, err := uuid.Parse(familyId)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid family ID format in context")
		return
	}

	walletTransfers, err := ctrl.svc.ListWalletTransfers(c, fid, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Wallet transfers retrieved successfully", walletTransfers)
}