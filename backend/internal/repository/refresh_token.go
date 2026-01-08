package repository

import (
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type RefreshTokenRepository interface {
	Create(refreshToken *model.RefreshToken) error
	GetByToken(token string) (*model.RefreshToken, error)
	Revoke(token string) error
	RevokeAllForUser(userID string) error
}

type refreshTokenRepository struct {
	db *gorm.DB
}

func NewRefreshTokenRepository(db *gorm.DB) RefreshTokenRepository {
	return &refreshTokenRepository{db: db}
}

func (r *refreshTokenRepository) Create(refreshToken *model.RefreshToken) error {
	return r.db.Create(refreshToken).Error
}

func (r *refreshTokenRepository) GetByToken(token string) (*model.RefreshToken, error) {
	var refreshToken model.RefreshToken
	err := r.db.Where("refresh_token = ?", token).First(&refreshToken).Error
	return &refreshToken, err
}

func (r *refreshTokenRepository) Revoke(token string) error {
	return r.db.Where("refresh_token = ?", token).Delete(&model.RefreshToken{}).Error
}

func (r *refreshTokenRepository) RevokeAllForUser(userID string) error {
	return r.db.Where("user_id = ?", userID).Delete(&model.RefreshToken{}).Error
}
