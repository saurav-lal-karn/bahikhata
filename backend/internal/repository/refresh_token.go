package repository

import (
	"context"

	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type RefreshTokenRepository interface {
	Create(ctx context.Context, refreshToken *model.RefreshToken) error
	GetByToken(ctx context.Context, token string) (*model.RefreshToken, error)
	Revoke(ctx context.Context, token string) error
	RevokeAllForUser(ctx context.Context, userID string) error
}

type refreshTokenRepository struct {
	db *gorm.DB
}

func NewRefreshTokenRepository(db *gorm.DB) RefreshTokenRepository {
	return &refreshTokenRepository{db: db}
}

func (r *refreshTokenRepository) Create(ctx context.Context, refreshToken *model.RefreshToken) error {
	return r.db.WithContext(ctx).Create(refreshToken).Error
}

func (r *refreshTokenRepository) GetByToken(ctx context.Context, token string) (*model.RefreshToken, error) {
	var refreshToken model.RefreshToken
	err := r.db.WithContext(ctx).Where("refresh_token = ?", token).First(&refreshToken).Error
	return &refreshToken, err
}

func (r *refreshTokenRepository) Revoke(ctx context.Context, token string) error {
	return r.db.WithContext(ctx).Where("refresh_token = ?", token).Delete(&model.RefreshToken{}).Error
}

func (r *refreshTokenRepository) RevokeAllForUser(ctx context.Context, userID string) error {
	return r.db.WithContext(ctx).Where("user_id = ?", userID).Delete(&model.RefreshToken{}).Error
}
