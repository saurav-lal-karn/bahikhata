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

type ExpenseService interface {
	Create(ctx context.Context, req *dto.CreateExpenseRequest, userId uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*model.Expense, error)
	List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]dto.Expense, error)
	Update(ctx context.Context, expense *model.Expense) error
	Delete(ctx context.Context, id uuid.UUID) error
	GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (*dto.ExpenseStatsResponse, error)
}

type expenseService struct {
	expenseRepo repository.ExpenseRepository
	paymentMethodRepo repository.PaymentMethodRepository
	categoryRepo repository.ExpenseCategoryRepository
	familyRepo repository.FamilyRepository
}

func NewExpenseService(expenseRepo repository.ExpenseRepository, paymentMethodRepo repository.PaymentMethodRepository, categoryRepo repository.ExpenseCategoryRepository, familyRepo repository.FamilyRepository) ExpenseService {
	return &expenseService{expenseRepo: expenseRepo, paymentMethodRepo: paymentMethodRepo, categoryRepo: categoryRepo, familyRepo: familyRepo}
}

func (s *expenseService) Create(ctx context.Context, req *dto.CreateExpenseRequest, userId uuid.UUID) error {
	// Verify the family exists
	familyID := uuid.MustParse(req.FamilyID)
	_, err := s.familyRepo.GetByID(ctx, familyID)
	if err != nil {
		return fmt.Errorf("Family not found: %w", err)
	}

	var paymentMethodID uuid.UUID
	var categoryID uuid.UUID


	if req.IsCustomPaymentMethod && req.CustomPaymentMethodName != "" {
		// Check if the payment method exists, if not, create a new one
		paymentMethod, err := s.paymentMethodRepo.GetByName(ctx, req.CustomPaymentMethodName, familyID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Payment method not found, create a new one
				paymentMethod, err = s.paymentMethodRepo.Create(ctx, model.PaymentMethod{
					ID: uuid.New(),
					Name: req.CustomPaymentMethodName,
					FamilyID: &familyID,
					CreatedByID: &userId,
					IsSystem: false,
				})
				if err != nil {
					return fmt.Errorf("Failed to create payment method: %w", err)
				}
			} else {
				// Some other error occurred
				return fmt.Errorf("Failed to get payment method: %w", err)
			}
		}
		paymentMethodID = paymentMethod.ID
	} else {
		// Verify the payment method exists
		paymentMethodID = uuid.MustParse(req.PaymentMethodID)
		_, err := s.paymentMethodRepo.GetByID(ctx, paymentMethodID)
		if err != nil {
			return fmt.Errorf("Payment method not found: %w", err)
		}
	}

	if req.IsCustomCategory && req.CustomCategoryName != "" {
		// Check if the category exists, if not, create a new one
		category, err := s.categoryRepo.GetByName(ctx, req.CustomCategoryName, familyID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Category not found, create a new one
				category, err = s.categoryRepo.Create(ctx, model.ExpenseCategory{
					ID:          uuid.New(),
					Name:        req.CustomCategoryName,
					FamilyID:    &familyID,
					CreatedByID: &userId,
					IsSystem:    false,
				})
				if err != nil {
					return fmt.Errorf("Failed to create category: %w", err)
				}
			} else {
				// Some other error occurred
				return fmt.Errorf("Failed to get category: %w", err)
			}
		}
		categoryID = category.ID
	} else {
		// Verify the category exists
		categoryID = uuid.MustParse(req.CategoryID)
		_, err := s.categoryRepo.GetByID(ctx, categoryID)
		if err != nil {
			return fmt.Errorf("Category not found: %w", err)
		}
	}

	// Parse the date (format: YYYY-MM-DD)
	transactionDate, err := time.Parse("2006-01-02", req.TransactionDate)
	if err != nil {
		return fmt.Errorf("Invalid date: %w", err)
	}

	expense := &model.Expense{
		ID: uuid.New(),
		Name: req.Name,
		Amount: req.Amount,
		Description: req.Description,
		PaymentMethodID: paymentMethodID,
		CategoryID: categoryID,
		FamilyID: familyID,
		CreatedByID: userId,
		TransactionDate: transactionDate,
	}
	return s.expenseRepo.Create(ctx, expense)
}

func (s *expenseService) GetByID(ctx context.Context, id uuid.UUID) (*model.Expense, error) {
	return s.expenseRepo.GetByID(ctx, id)
}

func (s *expenseService) List(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) ([]dto.Expense, error) {
	expenses, err := s.expenseRepo.List(ctx, familyID, userId)
	if err != nil {
		return nil, err
	}
	expenseDtos := make([]dto.Expense, len(expenses))
	for i, expense := range expenses {
		expenseDtos[i] = dto.Expense{
			ID: expense.ID.String(),
			Name: expense.Name,
			Amount: expense.Amount,
			Category: expense.Category.Name,
			PaymentMethod: expense.PaymentMethod.Name,
			Description: expense.Description,
			TransactionDate: expense.TransactionDate.Format("2006-01-02"),
		}
	}
	return expenseDtos, nil
}

func (s *expenseService) Update(ctx context.Context, expense *model.Expense) error {
	return s.expenseRepo.Update(ctx, expense)
}

func (s *expenseService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.expenseRepo.Delete(ctx, id)
}

func (s *expenseService) GetStats(ctx context.Context, familyID uuid.UUID, userId uuid.UUID) (*dto.ExpenseStatsResponse, error) {
	totalCount, totalAmount, thisMonth, lastMonth, err := s.expenseRepo.GetStats(ctx, familyID, userId)
	if err != nil {
		return nil, err
	}

	var averageExpense float64
	if totalCount > 0 {
		averageExpense = totalAmount / float64(totalCount)
	}

	return &dto.ExpenseStatsResponse{
		TotalExpenses:  totalCount,
		TotalAmount:    totalAmount,
		ThisMonth:      thisMonth,
		LastMonth:      lastMonth,
		AverageExpense: averageExpense,
	}, nil
}