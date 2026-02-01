package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateInvestmentValuationRequest struct {
	ValuationDate string  `json:"valuation_date" binding:"required"`
	PricePerUnit  float64 `json:"price_per_unit" binding:"required"`
}

func (req *CreateInvestmentValuationRequest) ToModel(investmentID uuid.UUID) *model.InvestmentValuation {
	valuationDate, err := time.Parse(time.RFC3339, req.ValuationDate)
	if err != nil {
		valuationDate, _ = time.Parse("2006-01-02", req.ValuationDate)
	}

	return &model.InvestmentValuation{
		ID:            uuid.New(),
		InvestmentID:  investmentID,
		ValuationDate: valuationDate,
		PricePerUnit:  req.PricePerUnit,
	}
}
