package service

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type SubscriptionService interface {
	CreateSubscription(ctx context.Context, req dto.CreateSubscriptionRequest, uid uuid.UUID) (*dto.SubscriptionResponse, error)
	GetSubscriptions(ctx context.Context, familyID uuid.UUID) ([]dto.SubscriptionResponse, error)
	GetSubscription(ctx context.Context, id uuid.UUID) (*dto.SubscriptionResponse, error)
	UpdateSubscription(ctx context.Context, id uuid.UUID, req dto.UpdateSubscriptionRequest) (*dto.SubscriptionResponse, error)
	DeleteSubscription(ctx context.Context, id uuid.UUID) error
}

type subscriptionService struct {
	repo          repository.SubscriptionRepository
	recurringRepo repository.RecurringTransactionRepository
}

func NewSubscriptionService(repo repository.SubscriptionRepository, recurringRepo repository.RecurringTransactionRepository) SubscriptionService {
	return &subscriptionService{
		repo:          repo,
		recurringRepo: recurringRepo,
	}
}

func (s *subscriptionService) CreateSubscription(ctx context.Context, req dto.CreateSubscriptionRequest, uid uuid.UUID) (*dto.SubscriptionResponse, error) {
	startDate, err := time.Parse(time.RFC3339, req.StartDate)
	if err != nil {
		startDate, _ = time.Parse("2006-01-02", req.StartDate)
	}

	var nextBilling *time.Time
	if req.NextBillingDate != nil {
		t, _ := time.Parse("2006-01-02", *req.NextBillingDate)
		nextBilling = &t
	}

	// Create Recurring Transaction
	rt := &model.RecurringTransaction{
		FamilyID:    &req.FamilyID,
		Amount:      req.Amount,
		Frequency:   model.RecurringFrequency(req.Frequency),
		StartDate:   startDate,
		NextDueDate: nextBilling,
		Description: "Subscription: " + req.Name,
		CategoryID:  req.CategoryID, // Can be nil
		WalletID:    req.WalletID,   // Can be nil
		IsActive:    true,
		Type:        string(model.CategoryTypeExpense), // Cast to string as model.RecurringTransaction.Type is string
		UserID:      &uid,
	}

	if err := s.recurringRepo.Create(ctx, rt); err != nil {
		return nil, err
	}

	sub := &model.Subscription{
		FamilyID:               req.FamilyID,
		Name:                   req.Name,
		Amount:                 req.Amount,
		Frequency:              model.RecurringFrequency(req.Frequency),
		CategoryID:             req.CategoryID,
		WalletID:               req.WalletID,
		VendorID:               req.VendorID,
		StartDate:              startDate,
		NextBillingDate:        nextBilling,
		Status:                 model.SubscriptionActive,
		RecurringTransactionID: &rt.ID,
	}

	if err := s.repo.CreateSubscription(ctx, sub); err != nil {
		return nil, err
	}

	created, _ := s.repo.GetSubscriptionByID(ctx, sub.ID)
	res := dto.ToSubscriptionResponse(*created)
	return &res, nil
}

func (s *subscriptionService) GetSubscriptions(ctx context.Context, familyID uuid.UUID) ([]dto.SubscriptionResponse, error) {
	subs, err := s.repo.GetSubscriptions(ctx, familyID)
	if err != nil {
		return nil, err
	}

	res := make([]dto.SubscriptionResponse, len(subs))
	for i, sub := range subs {
		res[i] = dto.ToSubscriptionResponse(sub)
	}
	return res, nil
}

func (s *subscriptionService) GetSubscription(ctx context.Context, id uuid.UUID) (*dto.SubscriptionResponse, error) {
	sub, err := s.repo.GetSubscriptionByID(ctx, id)
	if err != nil {
		return nil, err
	}
	res := dto.ToSubscriptionResponse(*sub)
	return &res, nil
}

func (s *subscriptionService) DeleteSubscription(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteSubscription(ctx, id)
}

func (s *subscriptionService) UpdateSubscription(ctx context.Context, id uuid.UUID, req dto.UpdateSubscriptionRequest) (*dto.SubscriptionResponse, error) {
	sub, err := s.repo.GetSubscriptionByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		sub.Name = req.Name
	}
	if req.Amount > 0 {
		sub.Amount = req.Amount
	}
	if req.Frequency != "" {
		sub.Frequency = model.RecurringFrequency(req.Frequency)
	}
	if req.CategoryID != nil {
		sub.CategoryID = req.CategoryID
	}
	if req.WalletID != nil {
		sub.WalletID = req.WalletID
	}
	if req.VendorID != nil {
		sub.VendorID = req.VendorID
	}
	if req.NextBillingDate != nil {
		t, _ := time.Parse("2006-01-02", *req.NextBillingDate)
		sub.NextBillingDate = &t
	}
	if req.Status != "" {
		sub.Status = model.SubscriptionStatus(req.Status)
	}

	if err := s.repo.UpdateSubscription(ctx, sub); err != nil {
		return nil, err
	}

	updated, _ := s.repo.GetSubscriptionByID(ctx, id)
	res := dto.ToSubscriptionResponse(*updated)
	return &res, nil
}
