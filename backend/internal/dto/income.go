package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type IncomeDTO struct {
	Name string `json:"name" binding:"required,max=100"`
	Amount float64 `json:"amount" binding:"required"`
	SourceId string `json:"source_id"`
	WalletId string `json:"wallet_id" binding:"required"`
	Date string `json:"date" binding:"required"`
	Description string `json:"description" binding:"max=255"`
	IsCustomSource bool `json:"is_custom_source"`
	CustomSourceName string `json:"custom_source_name"`
	FamilyId string `json:"family_id" binding:"required"`
}

func (i *IncomeDTO) ToModel() (*model.Income, error) {
	sourceId, err := uuid.Parse(i.SourceId)
	if err != nil {
		return nil, err
	}
	walletId, err := uuid.Parse(i.WalletId)
	if err != nil {
		return nil, err
	}
	familyId, err := uuid.Parse(i.FamilyId)
	if err != nil {
		return nil, err
	}
	date, err := time.Parse("2006-01-02", i.Date)
	if err != nil {
		return nil, err
	}
	return &model.Income{
		Name: i.Name,
		Amount: i.Amount,
		SourceID: &sourceId,
		WalletID: &walletId,
		Date: date,
		Description: i.Description,
		FamilyID: &familyId,
	}, nil
}