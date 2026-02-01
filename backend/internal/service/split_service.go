package service

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type SplitService interface {
	CreateSplit(req dto.CreateSplitRequest) (*dto.ExpenseSplitResponse, error)
	GetSplitByTransactionID(txID uuid.UUID) (*dto.ExpenseSplitResponse, error)
	CreateSettlement(req dto.CreateSplitSettlementRequest) error
}

type splitService struct {
	repo repository.SplitRepository
}

func NewSplitService(repo repository.SplitRepository) SplitService {
	return &splitService{repo: repo}
}

func (s *splitService) CreateSplit(req dto.CreateSplitRequest) (*dto.ExpenseSplitResponse, error) {
	// Validate total amount
	var sum float64
	for _, p := range req.Participants {
		sum += p.Amount
	}

	if req.SplitMethod == model.SplitExact && sum != req.TotalAmount {
		return nil, fmt.Errorf("sum of participant amounts must equal total amount")
	}

	split := &model.ExpenseSplit{
		TransactionID: req.TransactionID,
		TotalAmount:   req.TotalAmount,
		SplitMethod:   req.SplitMethod,
	}

	for _, p := range req.Participants {
		split.Participants = append(split.Participants, model.SplitParticipant{
			UserID:     p.UserID,
			ContactID:  p.ContactID,
			AmountOwed: p.Amount,
			Status:     model.SplitStatusUnpaid,
		})
	}

	if err := s.repo.CreateSplit(split); err != nil {
		return nil, err
	}

	return dto.ToExpenseSplitResponse(split), nil
}

func (s *splitService) GetSplitByTransactionID(txID uuid.UUID) (*dto.ExpenseSplitResponse, error) {
	split, err := s.repo.GetSplitByTransactionID(txID)
	if err != nil {
		return nil, err
	}
	return dto.ToExpenseSplitResponse(split), nil
}

func (s *splitService) CreateSettlement(req dto.CreateSplitSettlementRequest) error {
	settlement := req.ToModel()
	return s.repo.CreateSettlement(settlement)
}
