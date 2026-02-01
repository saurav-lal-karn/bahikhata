package dto

import (
	"github.com/sauravkarn541/bahikhata/internal/model"
)

// ==================== Request DTOs ====================

// CreateWalletRequest represents the payload for creating a new wallet.
type CreateWalletRequest struct {
	// Name of the wallet (required, max 100 characters)
	Name string `json:"name" binding:"required,max=100"`

	// StartingBalance is the initial balance (must be >= 0)
	StartingBalance float64 `json:"starting_balance" binding:"gte=0"`

	// Currency code (required, ISO 4217 format e.g., USD, INR)
	Currency string `json:"currency" binding:"required,len=3"`

	// Description of the wallet (optional, max 500 characters)
	Description string `json:"description" binding:"max=500"`

	// WalletIssuerName is the name of the bank/financial institution
	WalletIssuerName string `json:"wallet_issuer_name" binding:"required,max=100"`

	// ProviderWalletID is the external account/card number identifier
	ProviderWalletID string `json:"provider_wallet_id" binding:"required,max=100"`

	// WalletTypeID is required when IsCustomType is false (must be valid UUID)
	WalletTypeID string `json:"wallet_type_id" binding:"omitempty,uuid"`

	// IsCustomType indicates if a new wallet type should be created
	IsCustomType bool `json:"is_custom_type"`

	// CustomTypeName is required when IsCustomType is true (max 50 characters)
	CustomTypeName string `json:"custom_type_name" binding:"max=50"`

	// CustomTypeDescription is optional description for custom wallet type
	CustomTypeDescription string `json:"custom_type_description" binding:"max=500"`

	// FamilyID the wallet belongs to (required, must be valid UUID)
	FamilyID string `json:"family_id" binding:"required,uuid"`
}

// UpdateWalletRequest represents the payload for updating an existing wallet.
// Note: StartingBalance cannot be updated as it represents historical data.
type UpdateWalletRequest struct {
	// Name of the wallet (required, max 100 characters)
	Name string `json:"name" binding:"required,max=100"`

	// Currency code (required, ISO 4217 format)
	Currency string `json:"currency" binding:"required,len=3"`

	// Description of the wallet (optional, max 500 characters)
	Description string `json:"description" binding:"max=500"`

	// WalletIssuerName is the name of the bank/financial institution
	WalletIssuerName string `json:"wallet_issuer_name" binding:"max=100"`

	// ProviderWalletID is the external account/card number identifier
	ProviderWalletID string `json:"provider_wallet_id" binding:"max=100"`

	// WalletTypeID is required when IsCustomType is false
	WalletTypeID string `json:"wallet_type_id" binding:"omitempty,uuid"`

	// IsCustomType indicates if a new wallet type should be created
	IsCustomType bool `json:"is_custom_type"`

	// CustomTypeName is required when IsCustomType is true
	CustomTypeName string `json:"custom_type_name" binding:"max=50"`
}

// ==================== Response DTOs ====================

// WalletResponse represents the API response for a wallet.
type WalletResponse struct {
	ID               string              `json:"id"`
	Name             string              `json:"name"`
	StartingBalance  float64             `json:"starting_balance"`
	Balance          float64             `json:"balance"`
	Currency         string              `json:"currency"`
	Description      string              `json:"description,omitempty"`
	WalletIssuerName string              `json:"wallet_issuer_name"`
	ProviderWalletID string              `json:"provider_wallet_id"`
	WalletType       *WalletTypeResponse `json:"wallet_type,omitempty"`
	CreatedAt        string              `json:"created_at"`
	UpdatedAt        string              `json:"updated_at"`
}

// WalletTypeResponse represents wallet type information in API responses.
type WalletTypeResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// WalletListResponse represents a paginated list of wallets.
type WalletListResponse struct {
	Wallets    []WalletResponse `json:"wallets"`
	TotalCount int64            `json:"total_count"`
	Page       int              `json:"page"`
	PageSize   int              `json:"page_size"`
}

// ==================== Query Parameters ====================

// WalletListParams represents query parameters for listing wallets.
type WalletListParams struct {
	Page     int `form:"page" binding:"omitempty,min=1"`
	PageSize int `form:"page_size" binding:"omitempty,min=1,max=100"`
}

// GetPageWithDefault returns the page number with a default of 1.
func (p *WalletListParams) GetPageWithDefault() int {
	if p.Page <= 0 {
		return 1
	}
	return p.Page
}

// GetPageSizeWithDefault returns the page size with a default of 10.
func (p *WalletListParams) GetPageSizeWithDefault() int {
	if p.PageSize <= 0 {
		return 10
	}
	if p.PageSize > 100 {
		return 100
	}
	return p.PageSize
}

// ==================== Mappers ====================

// ToWalletResponse converts a model.Wallet to WalletResponse.
func ToWalletResponse(w *model.Wallet) WalletResponse {
	resp := WalletResponse{
		ID:               w.ID.String(),
		Name:             w.Name,
		StartingBalance:  w.StartingBalance,
		Balance:          w.Balance,
		Currency:         w.Currency,
		Description:      w.Description,
		WalletIssuerName: w.WalletIssuerName,
		ProviderWalletID: w.ProviderWalletID,
		CreatedAt:        w.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt:        w.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}

	if w.WalletType != nil {
		resp.WalletType = &WalletTypeResponse{
			ID:   w.WalletType.ID.String(),
			Name: w.WalletType.Name,
		}
	}

	return resp
}

// ToWalletListResponse converts a slice of wallets to WalletListResponse.
func ToWalletListResponse(wallets []model.Wallet, total int64, page, pageSize int) WalletListResponse {
	responses := make([]WalletResponse, len(wallets))
	for i := range wallets {
		responses[i] = ToWalletResponse(&wallets[i])
	}
	return WalletListResponse{
		Wallets:    responses,
		TotalCount: total,
		Page:       page,
		PageSize:   pageSize,
	}
}
