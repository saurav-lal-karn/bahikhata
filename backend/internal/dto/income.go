package dto

type IncomeDTO struct {
	Name string `json:"name" binding:"required"`
	Amount float64 `json:"amount" binding:"required"`
	SourceId string `json:"source_id"`
	WalletId string `json:"wallet_id" binding:"required"`
	Date string `json:"date" binding:"required"`
	Description string `json:"description"`
	IsCustomSource bool `json:"is_custom_source"`
	CustomSourceName string `json:"custom_source_name"`
	FamilyId string `json:"family_id" binding:"required"`
}
