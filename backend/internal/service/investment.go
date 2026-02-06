package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
)

type InvestmentService interface {
	Create(ctx context.Context, investment *dto.CreateInvestmentRequest, userID uuid.UUID) (*dto.InvestmentReponse, error)
	Update(ctx context.Context, id uuid.UUID, investment *dto.UpdateInvestmentRequest, userID uuid.UUID) (*dto.InvestmentReponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Investment, error)
	GetByID(ctx context.Context, investmentID uuid.UUID) (*dto.InvestmentReponse, error)
	
	CreateTransaction(ctx context.Context, investmentID uuid.UUID, transaction *dto.AddInvestmentTransactionRequest) (*dto.InvestmentTransactionResponse, error)
	ListTransactions(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentTransaction, error)
	
	CreateValuation(ctx context.Context, investmentID uuid.UUID, valuation *dto.CreateInvestmentValuationRequest) (*dto.InvestmentValuationResponse, error)
	ListValuations(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentValuation, error)
}

type investmentService struct {
	investmentRepo repository.InvestmentRepository
}

func NewInvestmentService(investmentRepo repository.InvestmentRepository) InvestmentService {
	return &investmentService{investmentRepo: investmentRepo}
}

func (s *investmentService) Create(ctx context.Context, investment *dto.CreateInvestmentRequest, userID uuid.UUID) (*dto.InvestmentReponse, error) {
	investmentModel := investment.ToModel()
	investmentModel.UserID = &userID

	investmentModel, err := s.investmentRepo.Create(ctx, investmentModel)
	if err != nil {
		return nil, err
	}
	return dto.ToInvestmentResponse(investmentModel), nil
}

func (s *investmentService) Update(ctx context.Context, id uuid.UUID, investment *dto.UpdateInvestmentRequest, userID uuid.UUID) (*dto.InvestmentReponse, error) {
	_, err := s.investmentRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("investment", id)
		}
		return nil, NewInternalError("get investment by id", err)
	}

	investmentModel := investment.ToModel(id)

	investmentModel, err = s.investmentRepo.Update(ctx, id, investmentModel)
	if err != nil {
		return nil, NewInternalError("update investment", err)
	}
	return dto.ToInvestmentResponse(investmentModel), nil
}

func (s *investmentService) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Investment, error) {
	return s.investmentRepo.List(ctx, familyID, userID)
}

func (s *investmentService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.investmentRepo.Delete(ctx, id)
}

func (s *investmentService) GetByID(ctx context.Context, investmentID uuid.UUID) (*dto.InvestmentReponse, error) {
	investmentModel, err := s.investmentRepo.GetByID(ctx, investmentID)
	if err != nil {
		return nil, err
	}
	return dto.ToInvestmentResponse(investmentModel), nil
}

func (s *investmentService) CreateTransaction(ctx context.Context, investmentID uuid.UUID, transaction *dto.AddInvestmentTransactionRequest) (*dto.InvestmentTransactionResponse, error) {
	transactionModel := transaction.ToModel(investmentID)
	transactionModel, err := s.investmentRepo.CreateTransaction(ctx, transactionModel)
	if err != nil {
		return nil, NewInternalError("create investment transaction", err)
	}
	return dto.ToInvestmentTransactionResponse(transactionModel), nil
}

func (s *investmentService) ListTransactions(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentTransaction, error) {
	return s.investmentRepo.ListTransactions(ctx, investmentID)
}

func (s *investmentService) CreateValuation(ctx context.Context, investmentID uuid.UUID, valuation *dto.CreateInvestmentValuationRequest) (*dto.InvestmentValuationResponse, error) {
	valuationModel := valuation.ToModel(investmentID)
	valuationModel, err := s.investmentRepo.CreateValuation(ctx, valuationModel)
	if err != nil {
		return nil, NewInternalError("create investment valuation", err)
	}
	return dto.ToInvestmentValuationResponse(valuationModel), nil
}

func (s *investmentService) ListValuations(ctx context.Context, investmentID uuid.UUID) ([]model.InvestmentValuation, error) {
	return s.investmentRepo.ListValuations(ctx, investmentID)
}
