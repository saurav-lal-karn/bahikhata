package repository

import (
	"context"
	"slices"

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
	AttachTags(ctx context.Context, entityID uuid.UUID, entityType string, tags []string, familyID uuid.UUID, userID uuid.UUID) error
	GetTagsByEntity(ctx context.Context, entityID uuid.UUID, entityType string) ([]string, error)
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

func (r *tagRepo) AttachTags(ctx context.Context, entityID uuid.UUID, entityType string, tags []string, familyID uuid.UUID, userID uuid.UUID) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Check if the tags are there
		if len(tags) == 0 {
			return nil
		}

		// Check if the tags exists, if not create the tag
		var tagIDs []uuid.UUID
		for _, tag := range tags {
			var existingTag model.Tag
			if err := tx.Where("name = ? AND family_id = ?", tag, familyID).First(&existingTag).Error; err != nil {
				if err == gorm.ErrRecordNotFound {
					t := &model.Tag{
						Name:        tag,
						FamilyID:    familyID,
						CreatedByID: &userID,
					}
					if err := tx.Create(t).Error; err != nil {
						return err
					}
					tagIDs = append(tagIDs, t.ID)
				}
			} else {
				tagIDs = append(tagIDs, existingTag.ID)
			}
		}

		// Prepare a list of entity tags to delete and which should be created and which should be skipped (Existing ones)
		var deletedTags []uuid.UUID
		var newTags []uuid.UUID
		var skippedTags []uuid.UUID

		// Get existing tags for this entity
		var existingTags []model.EntityTag
		if err := tx.Where("entity_id = ? AND entity_type = ?", entityID, entityType).Find(&existingTags).Error; err != nil {
			return err
		}

		// Prepare a list of entity tags to delete and which should be skipped (Existing ones)
		for _, existingTag := range existingTags {
			if !slices.Contains(tagIDs, existingTag.TagID) {
				deletedTags = append(deletedTags, existingTag.TagID)
			} else {
				skippedTags = append(skippedTags, existingTag.TagID)
			}
		}

		// Prepare a list of entity tags to create
		for _, tagID := range tagIDs {
			if !slices.Contains(skippedTags, tagID) {
				newTags = append(newTags, tagID)
			}
		}

		// Remove existing tags for this entity
		if len(deletedTags) > 0 {
			if err := tx.Where("entity_id = ? AND entity_type = ? AND tag_id IN ?", entityID, entityType, deletedTags).Delete(&model.EntityTag{}).Error; err != nil {
				return err
			}
		}
		// Add new tags
		for _, tagID := range newTags {
			if err := tx.Create(&model.EntityTag{EntityID: entityID, TagID: tagID, EntityType: entityType}).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *tagRepo) GetTagsByEntity(ctx context.Context, entityID uuid.UUID, entityType string) ([]string, error) {
	var tags []string

	err := r.db.WithContext(ctx).
		Table("tags").
		Select("tags.name").
		Joins("JOIN entity_tags ON entity_tags.tag_id = tags.id").
		Where("entity_tags.entity_id = ? AND entity_tags.entity_type = ?", entityID, entityType).
		Scan(&tags).Error

	return tags, err
}