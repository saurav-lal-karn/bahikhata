package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

	var req dto.CreateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	if req.IsCustomType {
		if req.CustomTypeName == "" {
			helper.ErrorResponse(c, http.StatusBadRequest, "custom_type_name is required when is_custom_type is true")
			return
		}
	} else {
		if req.WalletTypeID == "" {
			helper.ErrorResponse(c, http.StatusBadRequest, "wallet_type_id is required when is_custom_type is false")
			return
		}
	}

	wallet, err := ctrl.svc.CreateWallet(c, &req, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Wallet created successfully", wallet)
}

func (ctrl *WalletController) GetWallets(c *gin.Context) {
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


	familyID := c.Param("family_id")
	if familyID == "" {
		helper.ErrorResponse(c, http.StatusUnauthorized, "Family ID not found in context")
		return
	}

	fid, err := uuid.Parse(familyID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid family ID format in context")
		return
	}

	wallets, err := ctrl.svc.GetWallets(c, fid, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallets fetched successfully", wallets)
}

func (ctrl *WalletController) GetWalletDetails(c *gin.Context) {
	walletID := c.Param("wallet_id")
	if walletID == "" {
		helper.ErrorResponse(c, http.StatusUnauthorized, "Wallet ID not found in context")
		return
	}

	parsedWalletID, err := uuid.Parse(walletID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid wallet ID format in context")
		return
	}

	wallet, err := ctrl.svc.GetWalletDetails(c, parsedWalletID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet details fetched successfully", wallet)
}

func (ctrl *WalletController) UpdateWallet(c *gin.Context) {
	walletID := c.Param("wallet_id")
	if walletID == "" {
		helper.ErrorResponse(c, http.StatusUnauthorized, "Wallet ID not found in context")
		return
	}

	parsedWalletID, err := uuid.Parse(walletID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid wallet ID format in context")
		return
	}

	var req dto.CreateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

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

	wallet, err := ctrl.svc.UpdateWallet(c, parsedWalletID, &req, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet updated successfully", wallet)
}

func (ctrl *WalletController) DeleteWallet(c *gin.Context) {
	walletID := c.Param("wallet_id")
	if walletID == "" {
		helper.ErrorResponse(c, http.StatusUnauthorized, "Wallet ID not found in context")
		return
	}

	parsedWalletID, err := uuid.Parse(walletID)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid wallet ID format in context")
		return
	}

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

	err = ctrl.svc.DeleteWallet(c, parsedWalletID, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet deleted successfully", nil)
}
