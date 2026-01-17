package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type WalletTypeController struct {
	service service.WalletTypeService
}

func NewWalletTypeController(service service.WalletTypeService) WalletTypeController {
	return WalletTypeController{service: service}
}

func (ctrl *WalletTypeController) CreateWalletType(c *gin.Context) {
	var walletType model.WalletType
	if err := c.ShouldBindJSON(&walletType); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := ctrl.service.CreateWalletType(c.Request.Context(), &walletType); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet type created successfully", walletType)
}

func (ctrl *WalletTypeController) GetWalletTypes(c *gin.Context) {
	familyId := c.Param("family_id")
	if familyId == "" {
		helper.ErrorResponse(c, http.StatusBadRequest, "family_id is required")
		return
	}

	familyUid, err := uuid.Parse(familyId)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid family ID format")
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

	walletTypes, err := ctrl.service.GetWalletTypes(c.Request.Context(), familyUid, uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet types fetched successfully", walletTypes)
}