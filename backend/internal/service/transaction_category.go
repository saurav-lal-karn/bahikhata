package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// TransactionCategoryService defines the business logic for transaction categories.
type TransactionCategoryService interface {
	Create(ctx context.Context, req *dto.CreateTransactionCategoryRequest) (*dto.TransactionCategoryResponse, error)
	GetByID(ctx context.Context, id uuid.UUID) (*dto.TransactionCategoryResponse, error)
	List(ctx context.Context, familyID uuid.UUID, includeSystem bool, type_ string) ([]dto.TransactionCategoryResponse, error)
	Update(ctx context.Context, id uuid.UUID, req *dto.UpdateTransactionCategoryRequest) (*dto.TransactionCategoryResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type transactionCategoryService struct {
	categoryRepo repository.TransactionCategoryRepository
	familyRepo   repository.FamilyRepository
	logger       *logrus.Logger
}

// NewTransactionCategoryService creates a new instance of transactionCategoryService.
func NewTransactionCategoryService(
	categoryRepo repository.TransactionCategoryRepository,
	familyRepo repository.FamilyRepository,
	logger *logrus.Logger,
) TransactionCategoryService {
	return &transactionCategoryService{
		categoryRepo: categoryRepo,
		familyRepo:   familyRepo,
		logger:       logger,
	}
}

func (s *transactionCategoryService) Create(ctx context.Context, req *dto.CreateTransactionCategoryRequest) (*dto.TransactionCategoryResponse, error) {
	familyID, err := uuid.Parse(req.FamilyID)
	if err != nil {
		return nil, NewValidationError("invalid family_id")
	}

	// Verify family exists
	if _, err := s.familyRepo.GetByID(ctx, familyID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("family", familyID)
		}
		return nil, NewInternalError("verify family", err)
	}

	category := &model.TransactionCategory{
		ID:          uuid.New(),
		Name:        req.Name,
		Type:        req.Type,
		Description: req.Description,
		Icon:        req.Icon,
		Color:       req.Color,
		FamilyID:    &familyID,
		IsActive:    true,
		IsSystem:    false,
	}

	if req.ParentID != nil {
		parentID, err := uuid.Parse(*req.ParentID)
		if err != nil {
			return nil, NewValidationError("invalid parent_id")
		}
		category.ParentID = &parentID
	}

	created, err := s.categoryRepo.Create(ctx, category)
	if err != nil {
		return nil, NewInternalError("create category", err)
	}

	return dto.ToTransactionCategoryResponse(created), nil
}

func (s *transactionCategoryService) GetByID(ctx context.Context, id uuid.UUID) (*dto.TransactionCategoryResponse, error) {
	category, err := s.categoryRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("transaction category", id)
		}
		return nil, NewInternalError("get category", err)
	}
	return dto.ToTransactionCategoryResponse(category), nil
}

func (s *transactionCategoryService) List(ctx context.Context, familyID uuid.UUID, includeSystem bool, type_ string) ([]dto.TransactionCategoryResponse, error) {
	categories, err := s.categoryRepo.List(ctx, familyID, includeSystem, type_)
	if err != nil {
		return nil, NewInternalError("list categories", err)
	}

	responses := make([]dto.TransactionCategoryResponse, len(categories))
	for i := range categories {
		responses[i] = *dto.ToTransactionCategoryResponse(&categories[i])
	}
	return responses, nil
}

func (s *transactionCategoryService) Update(ctx context.Context, id uuid.UUID, req *dto.UpdateTransactionCategoryRequest) (*dto.TransactionCategoryResponse, error) {
	existing, err := s.categoryRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, NewNotFoundError("transaction category", id)
		}
		return nil, NewInternalError("get category", err)
	}

	if existing.IsSystem {
		return nil, NewValidationError("cannot update system categories")
	}

	updates := &model.TransactionCategory{
		Name:        req.Name,
		Description: req.Description,
		Icon:        req.Icon,
		Color:       req.Color,
		IsActive:    req.IsActive,
	}

	if req.ParentID != nil {
		parentID, err := uuid.Parse(*req.ParentID)
		if err != nil {
			return nil, NewValidationError("invalid parent_id")
		}
		updates.ParentID = &parentID
	} else {
		updates.ParentID = nil
	}

	updated, err := s.categoryRepo.Update(ctx, id, updates)
	if err != nil {
		return nil, NewInternalError("update category", err)
	}

	return dto.ToTransactionCategoryResponse(updated), nil
}

func (s *transactionCategoryService) Delete(ctx context.Context, id uuid.UUID) error {
	existing, err := s.categoryRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return NewNotFoundError("transaction category", id)
		}
		return NewInternalError("get category", err)
	}

	if existing.IsSystem {
		return NewValidationError("cannot delete system categories")
	}

	if err := s.categoryRepo.Delete(ctx, id); err != nil {
		return NewInternalError("delete category", err)
	}

	return nil
}
