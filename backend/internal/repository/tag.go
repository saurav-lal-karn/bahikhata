package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type TagRepository interface {
	Create(ctx context.Context, tag *model.Tag) error
	List(ctx context.Context, familyID uuid.UUID) ([]model.Tag, error)
	GetByID(ctx context.Context, id uuid.UUID) (*model.Tag, error)
	Update(ctx context.Context, tag *model.Tag) error
	Delete(ctx context.Context, id uuid.UUID) error
	AttachTags(ctx context.Context, entityID uuid.UUID, entityType string, tagIDs []uuid.UUID) error
	GetTagsByEntity(ctx context.Context, entityID uuid.UUID, entityType string) ([]model.Tag, error)
}

type tagRepo struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) TagRepository {
	return &tagRepo{db: db}
}

func (r *tagRepo) Create(ctx context.Context, tag *model.Tag) error {
	return r.db.WithContext(ctx).Create(tag).Error
}

func (r *tagRepo) List(ctx context.Context, familyID uuid.UUID) ([]model.Tag, error) {
	var tags []model.Tag
	if err := r.db.WithContext(ctx).Where("family_id = ?", familyID).Find(&tags).Error; err != nil {
		return nil, err
	}
	return tags, nil
}

func (r *tagRepo) GetByID(ctx context.Context, id uuid.UUID) (*model.Tag, error) {
	var tag model.Tag
	if err := r.db.WithContext(ctx).First(&tag, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &tag, nil
}

func (r *tagRepo) Update(ctx context.Context, tag *model.Tag) error {
	return r.db.WithContext(ctx).Save(tag).Error
}

func (r *tagRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Tag{}, "id = ?", id).Error
}

func (r *tagRepo) AttachTags(ctx context.Context, entityID uuid.UUID, entityType string, tagIDs []uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Remove existing tags for this entity
		if err := tx.Where("entity_id = ? AND entity_type = ?", entityID, entityType).Delete(&model.EntityTag{}).Error; err != nil {
			return err
		}
		// Add new tags
		for _, tagID := range tagIDs {
			if err := tx.Create(&model.EntityTag{EntityID: entityID, TagID: tagID, EntityType: entityType}).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *tagRepo) GetTagsByEntity(ctx context.Context, entityID uuid.UUID, entityType string) ([]model.Tag, error) {
	var tags []model.Tag
	err := r.db.WithContext(ctx).
		Joins("JOIN entity_tags ON entity_tags.tag_id = tags.id").
		Where("entity_tags.entity_id = ? AND entity_tags.entity_type = ?", entityID, entityType).
		Find(&tags).Error
	return tags, err
}