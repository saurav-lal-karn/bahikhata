package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type OrganizationRepository interface {
	// Tags
	CreateTag(ctx context.Context, tag *model.Tag) error
	ListTags(ctx context.Context, familyID uuid.UUID) ([]model.Tag, error)
	GetTagByID(ctx context.Context, id uuid.UUID) (*model.Tag, error)

	// Projects
	CreateProject(ctx context.Context, project *model.Project) error
	ListProjects(ctx context.Context, familyID uuid.UUID) ([]model.Project, error)
	GetProjectByID(ctx context.Context, id uuid.UUID) (*model.Project, error)

	// Locations
	CreateLocation(ctx context.Context, location *model.Location) error
	ListLocations(ctx context.Context) ([]model.Location, error)
	GetLocationByID(ctx context.Context, id uuid.UUID) (*model.Location, error)

	// Entity Tags
	AttachTags(ctx context.Context, entityID uuid.UUID, entityType string, tagIDs []uuid.UUID) error
	GetTagsByEntity(ctx context.Context, entityID uuid.UUID, entityType string) ([]model.Tag, error)
}

type orgRepo struct {
	db *gorm.DB
}

func NewOrganizationRepository(db *gorm.DB) OrganizationRepository {
	return &orgRepo{db: db}
}

func (r *orgRepo) CreateTag(ctx context.Context, tag *model.Tag) error {
	return r.db.WithContext(ctx).Create(tag).Error
}

func (r *orgRepo) ListTags(ctx context.Context, familyID uuid.UUID) ([]model.Tag, error) {
	var tags []model.Tag
	if err := r.db.WithContext(ctx).Where("family_id = ?", familyID).Find(&tags).Error; err != nil {
		return nil, err
	}
	return tags, nil
}

func (r *orgRepo) GetTagByID(ctx context.Context, id uuid.UUID) (*model.Tag, error) {
	var tag model.Tag
	if err := r.db.WithContext(ctx).First(&tag, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &tag, nil
}

func (r *orgRepo) CreateProject(ctx context.Context, project *model.Project) error {
	return r.db.WithContext(ctx).Create(project).Error
}

func (r *orgRepo) ListProjects(ctx context.Context, familyID uuid.UUID) ([]model.Project, error) {
	var projects []model.Project
	if err := r.db.WithContext(ctx).Where("family_id = ?", familyID).Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *orgRepo) GetProjectByID(ctx context.Context, id uuid.UUID) (*model.Project, error) {
	var project model.Project
	if err := r.db.WithContext(ctx).First(&project, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *orgRepo) CreateLocation(ctx context.Context, location *model.Location) error {
	return r.db.WithContext(ctx).Create(location).Error
}

func (r *orgRepo) ListLocations(ctx context.Context) ([]model.Location, error) {
	var locations []model.Location
	if err := r.db.WithContext(ctx).Find(&locations).Error; err != nil {
		return nil, err
	}
	return locations, nil
}

func (r *orgRepo) GetLocationByID(ctx context.Context, id uuid.UUID) (*model.Location, error) {
	var location model.Location
	if err := r.db.WithContext(ctx).First(&location, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &location, nil
}

func (r *orgRepo) AttachTags(ctx context.Context, entityID uuid.UUID, entityType string, tagIDs []uuid.UUID) error {
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

func (r *orgRepo) GetTagsByEntity(ctx context.Context, entityID uuid.UUID, entityType string) ([]model.Tag, error) {
	var tags []model.Tag
	err := r.db.WithContext(ctx).
		Joins("JOIN entity_tags ON entity_tags.tag_id = tags.id").
		Where("entity_tags.entity_id = ? AND entity_tags.entity_type = ?", entityID, entityType).
		Find(&tags).Error
	return tags, err
}
