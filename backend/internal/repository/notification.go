package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type NotificationRepository interface {
	List(ctx context.Context, userID uuid.UUID, familyID *uuid.UUID, status *string, limit int) ([]model.Notification, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Notification, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, userID uuid.UUID, status string) error
	MarkAllRead(ctx context.Context, userID uuid.UUID, familyID *uuid.UUID) error
}

type notificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) NotificationRepository {
	return &notificationRepository{db: db}
}

func (r *notificationRepository) List(ctx context.Context, userID uuid.UUID, familyID *uuid.UUID, status *string, limit int) ([]model.Notification, error) {
	var list []model.Notification
	query := r.db.WithContext(ctx).Where("user_id = ?", userID)
	if familyID != nil {
		query = query.Where("family_id = ?", *familyID)
	}
	if status != nil && *status != "" {
		query = query.Where("status = ?", *status)
	}
	if limit <= 0 {
		limit = 50
	}
	err := query.Order("created_at DESC").Limit(limit).Find(&list).Error
	return list, err
}

func (r *notificationRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Notification, error) {
	var n model.Notification
	if err := r.db.WithContext(ctx).First(&n, id).Error; err != nil {
		return nil, err
	}
	return &n, nil
}

func (r *notificationRepository) UpdateStatus(ctx context.Context, id uuid.UUID, userID uuid.UUID, status string) error {
	return r.db.WithContext(ctx).Model(&model.Notification{}).
		Where("id = ? AND user_id = ?", id, userID).
		Update("status", status).Error
}

func (r *notificationRepository) MarkAllRead(ctx context.Context, userID uuid.UUID, familyID *uuid.UUID) error {
	query := r.db.WithContext(ctx).Model(&model.Notification{}).Where("user_id = ? AND status = ?", userID, "unread")
	if familyID != nil {
		query = query.Where("family_id = ?", *familyID)
	}
	return query.Update("status", "read").Error
}
