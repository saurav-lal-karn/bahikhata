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
	Create(ctx context.Context, income *dto.IncomeDTO, created_by_id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*model.Income, error)
	List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Income, error)
	Update(ctx context.Context, id uuid.UUID, income *model.Income) (*model.Income, error)
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

func (s *incomeService) Create(ctx context.Context, income *dto.IncomeDTO, created_by_id uuid.UUID) error {
	// Verify the family exists
	familyID := uuid.MustParse(income.FamilyId)
	_, err := s.familyRepo.GetByID(ctx, familyID)
	if err != nil {
		return fmt.Errorf("Family not found: %w", err)
	}

	// Verify the wallet exists
	walletID := uuid.MustParse(income.WalletId)
	_, err = s.walletRepo.GetByID(ctx, walletID)
	if err != nil {
		return fmt.Errorf("Wallet not found: %w", err)
	}

	var incomeTypeId uuid.UUID
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
					CreatedByID: &created_by_id,
					IsSystem: false,
				})
				if err != nil {
					return fmt.Errorf("Failed to create income type: %w", err)
				}
			} else {
				// Some other error occurred
				return fmt.Errorf("Failed to get income type: %w", err)
			}
		}
		incomeTypeId = incomeType.ID
	} else {
		// Verify the income type exists
		incomeTypeId = uuid.MustParse(income.SourceId)
		_, err := s.incomeTypeRepo.GetByID(ctx, incomeTypeId)
		if err != nil {
			return fmt.Errorf("Source not found: %w", err)
		}
	}

	// Parse the date (format: YYYY-MM-DD)
	transactionDate, err := time.Parse("2006-01-02", income.Date)
	if err != nil {
		return fmt.Errorf("Invalid date: %w", err)
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

func (s *incomeService) Update(ctx context.Context, id uuid.UUID, income *model.Income) (*model.Income, error) {
	return s.incomeRepo.Update(ctx, id, income)
}

func (s *incomeService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.incomeRepo.Delete(ctx, id)
}

func (s *incomeService) GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (error) {
	return s.incomeRepo.GetStats(ctx, familyID, userId)
}