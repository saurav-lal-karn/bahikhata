package repository

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *model.User) error
	GetByEmail(email string) (*model.User, error)
	ListUsers() ([]model.User, error)
	GetUserById(id uuid.UUID) (*model.User, error)
	UpdateUser(user *model.User) error
	DeleteUser(id uuid.UUID) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) GetByEmail(email string) (*model.User, error) {
	var user model.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *userRepository) ListUsers() ([]model.User, error) {
	var users []model.User
	err := r.db.Find(&users).Error
	return users, err
}

func (r *userRepository) GetUserById(id uuid.UUID) (*model.User, error) {
	var user model.User
	err := r.db.Where("id = ?", id).First(&user).Error
	return &user, err
}

func (r *userRepository) UpdateUser(user *model.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) DeleteUser(id uuid.UUID) error {
	return r.db.Delete(&model.User{}, id).Error
}