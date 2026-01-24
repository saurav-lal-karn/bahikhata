package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
)

type IncomeService interface {
	Create(ctx context.Context, income *dto.IncomeDTO, created_by_id uuid.UUID) (*model.Income, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Income, error)
	List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Income, error)
	Update(ctx context.Context, id uuid.UUID, income *dto.IncomeDTO, createdByID uuid.UUID) (*model.Income, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (error)
}

type incomeService struct {
	incomeRepo repository.IncomeRepository
	walletRepo repository.WalletRepository
	incomeTypeRepo repository.IncomeTypeRepository
	familyRepo repository.FamilyRepository
}

func NewIncomeService(repo repository.IncomeRepository, walletRepo repository.WalletRepository, incomeTypeRepo repository.IncomeTypeRepository, familyRepo repository.FamilyRepository) IncomeService {
	return &incomeService{incomeRepo: repo, walletRepo: walletRepo, incomeTypeRepo: incomeTypeRepo, familyRepo: familyRepo}
}

func (s *incomeService) Create(ctx context.Context, income *dto.IncomeDTO, created_by_id uuid.UUID) (*model.Income, error) {
	// Validate the input
	if err := s.validateIncomeRequest(income); err != nil {
		return nil, err
	}

	// Verify the family exists
	familyID, err := uuid.Parse(income.FamilyId)
	if err != nil {
		return nil, NewValidationError("Invalid family ID in context")
	}

	_, err = s.familyRepo.GetByID(ctx, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewValidationError("Family not found")
		}
		return nil, NewInternalError("verify family", err)
	}

	// Verify the wallet exists
	walletID := uuid.MustParse(income.WalletId)
	_, err = s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewValidationError("Wallet not found")
		}
		return nil, NewInternalError("verify wallet", err)
	}

	incomeTypeId, err := s.resolveIncomeTypeID(ctx, income, familyID, created_by_id)
	if err != nil {
		return nil, err
	}

	// Parse the date (format: YYYY-MM-DD)
	transactionDate, err := time.Parse("2006-01-02", income.Date)
	if err != nil {
		return nil, fmt.Errorf("Invalid date: %w", err)
	}

	createIncome := &model.Income{
		ID: uuid.New(),
		Name: income.Name,
		Amount: income.Amount,
		Description: income.Description,
		SourceID: &incomeTypeId,
		WalletID: &walletID,
		FamilyID: &familyID,
		CreatedByID: &created_by_id,
		Date: transactionDate,
	}
	return s.incomeRepo.Create(ctx, createIncome)
}

func (s *incomeService) GetByID(ctx context.Context, id uuid.UUID) (*model.Income, error) {
	return s.incomeRepo.GetByID(ctx, id)
}

func (s *incomeService) List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Income, error) {
	return s.incomeRepo.List(ctx, familyID, userId)
}

func (s *incomeService) Update(ctx context.Context, id uuid.UUID, income *dto.IncomeDTO, createdByID uuid.UUID) (*model.Income, error) {
	// Validate the input
	if err := s.validateIncomeRequest(income); err != nil {
		return nil, err
	}

	// 1. Get the income by id
	existingIncome, err := s.incomeRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("income not found", id)
		}
		return nil, NewInternalError("get income", err)
	}

	// 2. Parse and validate family ID
	familyID, err := uuid.Parse(income.FamilyId)
	if err != nil {
		return nil, NewInternalError("parse family id", err)
	}

	// 3. Verify the family exists
	_, err = s.familyRepo.GetByID(ctx, familyID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewValidationError("Family not found")
		}
		return nil, NewInternalError("verify family", err)
	}

	// 3. Verify the wallet exists
	walletID, err := uuid.Parse(income.WalletId)
	if err != nil {
		return nil, NewInternalError("parse wallet id", err)
	}
	_, err = s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewValidationError("Wallet not found")
		}
		return nil, NewInternalError("verify wallet", err)
	}

	// 4. Resolve the income type ID
	incomeTypeId, err := s.resolveIncomeTypeID(ctx, income, familyID, createdByID)
	if err != nil {
		return nil, err
	}

	// 5. Parse the date (format: YYYY-MM-DD)
	transactionDate, err := time.Parse("2006-01-02", income.Date)
	if err != nil {
		return nil, fmt.Errorf("Invalid date: %w", err)
	}

	// 5. Update the income
	existingIncome.Name = income.Name
	existingIncome.Amount = income.Amount
	existingIncome.Description = income.Description
	existingIncome.SourceID = &incomeTypeId
	existingIncome.Date = transactionDate
	existingIncome.WalletID = &walletID
	existingIncome.FamilyID = &familyID
	existingIncome.CreatedByID = &createdByID

	return s.incomeRepo.Update(ctx, id, existingIncome)
}

func (s *incomeService) Delete(ctx context.Context, id uuid.UUID) error {
	// 1. Get the income by id
	_, err := s.incomeRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return NewNotFoundError("income not found", id)
		}
		return NewInternalError("get income", err)
	}
	return s.incomeRepo.Delete(ctx, id)
}

func (s *incomeService) GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (error) {
	return s.incomeRepo.GetStats(ctx, familyID, userId)
}

func(s *incomeService) validateIncomeRequest(req *dto.IncomeDTO) error {
	if req.Amount <= 0 {
		return NewValidationError("amount must be greater than 0")
	}
	return nil
}

func(s *incomeService) resolveIncomeTypeID(ctx context.Context, income *dto.IncomeDTO, familyID uuid.UUID, createdByID uuid.UUID) (uuid.UUID, error) {
	if income.IsCustomSource {
		// Check if the income type exists, if not, create a new one
		incomeType, err := s.incomeTypeRepo.GetByName(ctx, income.CustomSourceName, familyID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Income type not found, create a new one
				incomeType, err = s.incomeTypeRepo.Create(ctx, &model.IncomeType{
					ID: uuid.New(),
					Name: income.CustomSourceName,
					FamilyID: &familyID,
					CreatedByID: &createdByID,
					IsSystem: false,
				})
				if err != nil {
					return uuid.Nil, NewInternalError("create custom income type", err)
				}
			} else {
				// Some other error occurred
				return uuid.Nil, NewInternalError("get custom income type", err)
			}
		}
		return incomeType.ID, nil
	} else {
		// Verify the income type exists
		incomeTypeId, err := uuid.Parse(income.SourceId)
		if err != nil {
			return uuid.Nil, NewInternalError("parse income type", err)
		}

		_, err = s.incomeTypeRepo.GetByID(ctx, incomeTypeId)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return uuid.Nil, NewNotFoundError("income type not found", incomeTypeId)
			}
			return uuid.Nil, NewInternalError("get income type", err)
		}
		return incomeTypeId, nil
	}
}
	