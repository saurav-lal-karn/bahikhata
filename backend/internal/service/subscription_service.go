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
	CreateSubscription(req dto.CreateSubscriptionRequest) (*dto.SubscriptionResponse, error)
	GetSubscriptions(familyID uuid.UUID) ([]dto.SubscriptionResponse, error)
	GetSubscription(id uuid.UUID) (*dto.SubscriptionResponse, error)
	DeleteSubscription(id uuid.UUID) error
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

func (s *subscriptionService) CreateSubscription(req dto.CreateSubscriptionRequest) (*dto.SubscriptionResponse, error) {
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
		UserID:      nil,                               // Family level for now
	}

	// We use background context here as service methods in this project seem to not take context yet (refactor needed later)
	// But actually, repositories in this project seem to vary. SubscriptionRepo doesn't take context, RecurringRepo does.
	ctx := context.Background()

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
		StartDate:              startDate,
		NextBillingDate:        nextBilling,
		Status:                 model.SubscriptionActive,
		RecurringTransactionID: &rt.ID,
	}

	if err := s.repo.CreateSubscription(sub); err != nil {
		return nil, err
	}

	created, _ := s.repo.GetSubscriptionByID(sub.ID)
	res := dto.ToSubscriptionResponse(*created)
	return &res, nil
}

func (s *subscriptionService) GetSubscriptions(familyID uuid.UUID) ([]dto.SubscriptionResponse, error) {
	subs, err := s.repo.GetSubscriptions(familyID)
	if err != nil {
		return nil, err
	}

	res := make([]dto.SubscriptionResponse, len(subs))
	for i, sub := range subs {
		res[i] = dto.ToSubscriptionResponse(sub)
	}
	return res, nil
}

func (s *subscriptionService) GetSubscription(id uuid.UUID) (*dto.SubscriptionResponse, error) {
	sub, err := s.repo.GetSubscriptionByID(id)
	if err != nil {
		return nil, err
	}
	res := dto.ToSubscriptionResponse(*sub)
	return &res, nil
}

func (s *subscriptionService) DeleteSubscription(id uuid.UUID) error {
	return s.repo.DeleteSubscription(id)
}
