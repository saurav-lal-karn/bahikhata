package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

// WalletController handles HTTP requests for wallet operations.
type WalletController struct {
	svc service.WalletService
}

// NewWalletController creates a new WalletController instance.
func NewWalletController(svc service.WalletService) *WalletController {
	return &WalletController{svc: svc}
}

// Create handles POST /wallets - creates a new wallet.
//
// @Summary Create a new wallet
// @Description Creates a new wallet for the authenticated user
// @Tags Wallets
// @Accept json
// @Produce json
// @Param request body dto.CreateWalletRequest true "Create Wallet Request"
// @Success 201 {object} helper.Response{data=dto.WalletResponse}
// @Failure 400 {object} helper.Response "Validation error"
// @Failure 401 {object} helper.Response "Unauthorized"
// @Failure 409 {object} helper.Response "Wallet name already exists"
// @Failure 500 {object} helper.Response "Internal server error"
// @Router /wallets [post]
func (ctrl *WalletController) Create(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	var req dto.CreateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	wallet, err := ctrl.svc.Create(c.Request.Context(), &req, userID)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusCreated, "Wallet created successfully", wallet)
}

// List handles GET /wallets/family/:family_id - lists wallets for a family.
//
// @Summary List wallets for a family
// @Description Retrieves a paginated list of wallets for the specified family
// @Tags Wallets
// @Produce json
// @Param family_id path string true "Family ID (UUID)"
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Success 200 {object} helper.Response{data=dto.WalletListResponse}
// @Failure 400 {object} helper.Response "Invalid family_id format"
// @Failure 401 {object} helper.Response "Unauthorized"
// @Failure 500 {object} helper.Response "Internal server error"
// @Router /wallets/family/{family_id} [get]
func (ctrl *WalletController) List(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	familyID, err := parseUUIDParam(c, "family_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// Parse pagination parameters
	var params dto.WalletListParams
	if err := c.ShouldBindQuery(&params); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	page := params.GetPageWithDefault()
	pageSize := params.GetPageSizeWithDefault()

	wallets, err := ctrl.svc.List(c.Request.Context(), familyID, userID, page, pageSize)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallets fetched successfully", wallets)
}

// GetByID handles GET /wallets/:wallet_id - gets a wallet by ID.
//
// @Summary Get wallet by ID
// @Description Retrieves a wallet by its ID
// @Tags Wallets
// @Produce json
// @Param wallet_id path string true "Wallet ID (UUID)"
// @Success 200 {object} helper.Response{data=dto.WalletResponse}
// @Failure 400 {object} helper.Response "Invalid wallet_id format"
// @Failure 401 {object} helper.Response "Unauthorized"
// @Failure 403 {object} helper.Response "Forbidden - user doesn't own the wallet"
// @Failure 404 {object} helper.Response "Wallet not found"
// @Failure 500 {object} helper.Response "Internal server error"
// @Router /wallets/{wallet_id} [get]
func (ctrl *WalletController) GetByID(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	walletID, err := parseUUIDParam(c, "wallet_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	wallet, err := ctrl.svc.GetByID(c.Request.Context(), walletID, userID)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet fetched successfully", wallet)
}

// Update handles PUT /wallets/:wallet_id - updates a wallet.
//
// @Summary Update a wallet
// @Description Updates an existing wallet (StartingBalance cannot be changed)
// @Tags Wallets
// @Accept json
// @Produce json
// @Param wallet_id path string true "Wallet ID (UUID)"
// @Param request body dto.UpdateWalletRequest true "Update Wallet Request"
// @Success 200 {object} helper.Response{data=dto.WalletResponse}
// @Failure 400 {object} helper.Response "Validation error"
// @Failure 401 {object} helper.Response "Unauthorized"
// @Failure 403 {object} helper.Response "Forbidden - user doesn't own the wallet"
// @Failure 404 {object} helper.Response "Wallet not found"
// @Failure 409 {object} helper.Response "Wallet name already exists"
// @Failure 500 {object} helper.Response "Internal server error"
// @Router /wallets/{wallet_id} [put]
func (ctrl *WalletController) Update(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	walletID, err := parseUUIDParam(c, "wallet_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	var req dto.UpdateWalletRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	wallet, err := ctrl.svc.Update(c.Request.Context(), walletID, &req, userID)
	if err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet updated successfully", wallet)
}

// Delete handles DELETE /wallets/:wallet_id - deletes a wallet.
//
// @Summary Delete a wallet
// @Description Soft-deletes a wallet by its ID
// @Tags Wallets
// @Produce json
// @Param wallet_id path string true "Wallet ID (UUID)"
// @Success 200 {object} helper.Response "Wallet deleted successfully"
// @Failure 400 {object} helper.Response "Invalid wallet_id format"
// @Failure 401 {object} helper.Response "Unauthorized"
// @Failure 403 {object} helper.Response "Forbidden - user doesn't own the wallet"
// @Failure 404 {object} helper.Response "Wallet not found"
// @Failure 500 {object} helper.Response "Internal server error"
// @Router /wallets/{wallet_id} [delete]
func (ctrl *WalletController) Delete(c *gin.Context) {
	userID, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	walletID, err := parseUUIDParam(c, "wallet_id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := ctrl.svc.Delete(c.Request.Context(), walletID, userID); err != nil {
		handleServiceError(c, err)
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Wallet deleted successfully", nil)
}
