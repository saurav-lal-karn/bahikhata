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
	CreateIncome(ctx context.Context, income *dto.IncomeDTO, created_by_id uuid.UUID) error
	GetIncomeById(ctx context.Context, id uuid.UUID) (*model.Income, error)
	ListIncomes(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Income, error)
	UpdateIncome(ctx context.Context, income *model.Income) error
	DeleteIncome(ctx context.Context, id uuid.UUID) error
	GetIncomeStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (error)
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

func (s *incomeService) CreateIncome(ctx context.Context, income *dto.IncomeDTO, created_by_id uuid.UUID) error {
	// Verify the family exists
	familyID := uuid.MustParse(income.FamilyId)
	_, err := s.familyRepo.GetFamilyById(ctx, familyID)
	if err != nil {
		return fmt.Errorf("Family not found: %w", err)
	}

	// Verify the wallet exists
	walletID := uuid.MustParse(income.WalletId)
	_, err = s.walletRepo.GetWalletById(ctx, walletID)
	if err != nil {
		return fmt.Errorf("Wallet not found: %w", err)
	}

	var incomeTypeId uuid.UUID
	if income.IsCustomSource {
		// Check if the income type exists, if not, create a new one
		incomeType, err := s.incomeTypeRepo.GetIncomeTypeByName(ctx, income.CustomSourceName, familyID)
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
		_, err := s.incomeTypeRepo.GetIncomeTypeById(ctx, incomeTypeId)
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
	return s.incomeRepo.CreateIncome(ctx, createIncome)
}

func (s *incomeService) GetIncomeById(ctx context.Context, id uuid.UUID) (*model.Income, error) {
	return s.incomeRepo.GetIncomeById(ctx, id)
}

func (s *incomeService) ListIncomes(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]model.Income, error) {
	return s.incomeRepo.ListIncomes(ctx, familyID, userId)
}

func (s *incomeService) UpdateIncome(ctx context.Context, income *model.Income) error {
	return s.incomeRepo.UpdateIncome(ctx, income)
}

func (s *incomeService) DeleteIncome(ctx context.Context, id uuid.UUID) error {
	return s.incomeRepo.DeleteIncome(ctx, id)
}

func (s *incomeService) GetIncomeStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (error) {
	return s.incomeRepo.GetIncomeStats(ctx, familyID, userId)
}