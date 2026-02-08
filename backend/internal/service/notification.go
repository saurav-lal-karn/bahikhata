package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/notification"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type NotificationService interface {
	List(ctx context.Context, userID uuid.UUID, familyID *uuid.UUID, status *string, limit int) ([]dto.NotificationResponse, error)
	MarkRead(ctx context.Context, id uuid.UUID, userID uuid.UUID, status string) error
	MarkAllRead(ctx context.Context, userID uuid.UUID, familyID *uuid.UUID) error
	Create(ctx context.Context, userID uuid.UUID, familyID uuid.UUID, title, message, nType string) error
}

type notificationService struct {
	repo repository.NotificationRepository
	hub  *notification.Hub
}

func NewNotificationService(repo repository.NotificationRepository, hub *notification.Hub) NotificationService {
	return &notificationService{repo: repo, hub: hub}
}

func (s *notificationService) List(ctx context.Context, userID uuid.UUID, familyID *uuid.UUID, status *string, limit int) ([]dto.NotificationResponse, error) {
	list, err := s.repo.List(ctx, userID, familyID, status, limit)
	if err != nil {
		return nil, err
	}
	out := make([]dto.NotificationResponse, len(list))
	for i := range list {
		out[i] = dto.NotificationToResponse(&list[i])
	}
	return out, nil
}

func (s *notificationService) MarkRead(ctx context.Context, id uuid.UUID, userID uuid.UUID, status string) error {
	n, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if n.UserID != userID {
		return NewUnauthorizedError("not your notification")
	}
	return s.repo.UpdateStatus(ctx, id, userID, status)
}

func (s *notificationService) MarkAllRead(ctx context.Context, userID uuid.UUID, familyID *uuid.UUID) error {
	return s.repo.MarkAllRead(ctx, userID, familyID)
}

func (s *notificationService) Create(ctx context.Context, userID uuid.UUID, familyID uuid.UUID, title, message, nType string) error {
	n := &model.Notification{
		UserID:   userID,
		FamilyID: familyID,
		Title:    title,
		Message:  message,
		Type:     nType,
		Status:   "unread",
	}

	if err := s.repo.Create(ctx, n); err != nil {
		return err
	}

	// Broadcast via Hub
	resp := dto.NotificationToResponse(n)
	s.hub.Broadcast(notification.Message{
		UserID:   userID,
		FamilyID: familyID,
		Data:     resp,
	})

	return nil
}
