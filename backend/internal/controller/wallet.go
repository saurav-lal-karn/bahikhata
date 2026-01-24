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

func (ctrl *WalletController) Create(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	var req dto.CreateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	wallet, err := ctrl.svc.Create(c, &req, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Wallet created successfully", wallet)
}

func (ctrl *WalletController) List(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	fid, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	wallets, err := ctrl.svc.List(c, fid, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallets fetched successfully", wallets)
}

func (ctrl *WalletController) GetByID(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	walletID, err := parseUUIDParam(c, "wallet_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	wallet, err := ctrl.svc.GetByID(c, walletID, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet details fetched successfully", wallet)
}

func (ctrl *WalletController) Update(c *gin.Context) {
	walletID, err := parseUUIDParam(c, "wallet_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.CreateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	wallet, err := ctrl.svc.Update(c, walletID, &req, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet updated successfully", wallet)
}

func (ctrl *WalletController) Delete(c *gin.Context) {
	walletID, err := parseUUIDParam(c, "wallet_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	err = ctrl.svc.Delete(c, walletID, uid)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet deleted successfully", nil)
}
