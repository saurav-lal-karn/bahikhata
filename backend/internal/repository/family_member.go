package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type FamilyMemberRepository interface {
	CreateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	GetFamilyMemberById(ctx context.Context, id string) (*model.FamilyMember, error)
	GetFamilyMembersByFamilyId(ctx context.Context, familyId string) ([]model.User, error)
	UpdateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	DeleteFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error
	CheckUserInFamily(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) (bool, error)
}

type familyMemberRepository struct {
	db *gorm.DB
}

func NewFamilyMemberRepository(db *gorm.DB) FamilyMemberRepository {
	return &familyMemberRepository{db: db}
}

func (r *familyMemberRepository) CreateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	return r.db.WithContext(ctx).Create(familyMember).Error
}

func (r *familyMemberRepository) GetFamilyMemberById(ctx context.Context, id string) (*model.FamilyMember, error) {
	var familyMember model.FamilyMember
	if err := r.db.WithContext(ctx).First(&familyMember, id).Error; err != nil {
		return nil, err
	}
	return &familyMember, nil
}

func (r *familyMemberRepository) GetFamilyMembersByFamilyId(ctx context.Context, familyId string) ([]model.User, error) {
	var familyMembers []model.FamilyMember
	if err := r.db.WithContext(ctx).Where("family_id = ?", familyId).Preload("User").Find(&familyMembers).Error; err != nil {
		return nil, err
	}

	var users []model.User
	for _, fm := range familyMembers {
		users = append(users, fm.User)
	}

	return users, nil
}

func (r *familyMemberRepository) UpdateFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	return r.db.WithContext(ctx).Save(familyMember).Error
}

func (r *familyMemberRepository) DeleteFamilyMember(ctx context.Context, familyMember *model.FamilyMember) error {
	return r.db.WithContext(ctx).Delete(familyMember).Error
}

func (r *familyMemberRepository) CheckUserInFamily(ctx context.Context, familyId uuid.UUID, userId uuid.UUID) (bool, error) {
	var familyMember model.FamilyMember
	if err := r.db.WithContext(ctx).Where("family_id = ? AND user_id = ?", familyId, userId).First(&familyMember).Error; err != nil {
		return false, err
	}
	return true, nil
}