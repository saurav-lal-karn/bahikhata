package dto

type CreateWalletRequest struct {
	Name string `json:"name" binding:"required"`
	StartingBalance float64 `json:"starting_balance" binding:"required"`
	Currency string `json:"currency" binding:"required"`
	Description string `json:"description" binding:"required"`
	WalletIssuerName string `json:"wallet_issuer_name" binding:"required"`
	WalletID string `json:"wallet_id" binding:"required"`
	WalletTypeID string `json:"wallet_type_id"`
	IsCustomType bool `json:"is_custom_type"`
	CustomTypeName string `json:"custom_type_name"`
	CustomTypeDescription string `json:"custom_type_description"`
	FamilyID string `json:"family_id" binding:"required"`
}