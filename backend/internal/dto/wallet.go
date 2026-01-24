package dto

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateWalletRequest struct {
	// constants.MaxWalletNameLength = 100
	Name string `json:"name" binding:"required,max=100"`
	StartingBalance float64 `json:"starting_balance" binding:"required"`
	Currency string `json:"currency" binding:"required"`
	// constants.MaxWalletDescriptionLength = 500
	Description string `json:"description" binding:"max=500"`
	WalletIssuerName string `json:"wallet_issuer_name" binding:"required"`
	ProviderWalletID string `json:"provider_wallet_id" binding:"required"`
	WalletTypeID string `json:"wallet_type_id"`
	IsCustomType bool `json:"is_custom_type"`
	CustomTypeName string `json:"custom_type_name"`
	CustomTypeDescription string `json:"custom_type_description"`
	FamilyID string `json:"family_id" binding:"required"`
}

func (c *CreateWalletRequest) ToModel() (*model.Wallet, error) {
	walletTypeID, err := uuid.Parse(c.WalletTypeID)
	if err != nil {
		return nil, err
	}
	familyID, err := uuid.Parse(c.FamilyID)
	if err != nil {
		return nil, err
	}
	return &model.Wallet{
		Name: c.Name,
		StartingBalance: c.StartingBalance,
		Currency: c.Currency,
		Description: c.Description,
		WalletIssuerName: c.WalletIssuerName,
		ProviderWalletID: c.ProviderWalletID,
		WalletTypeID: walletTypeID,
		FamilyID: familyID,
	}, nil
}