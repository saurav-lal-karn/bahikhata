package repository

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type AttachmentRepository interface {
	Create(attachment *model.Attachment) error
	GetByID(id uuid.UUID) (*model.Attachment, error)
	GetByEntity(entityType string, entityID uuid.UUID) ([]model.Attachment, error)
	Delete(id uuid.UUID) error
}

type attachmentRepository struct {
	db *gorm.DB
}

func NewAttachmentRepository(db *gorm.DB) AttachmentRepository {
	return &attachmentRepository{db: db}
}

func (r *attachmentRepository) Create(attachment *model.Attachment) error {
	return r.db.Create(attachment).Error
}

func (r *attachmentRepository) GetByID(id uuid.UUID) (*model.Attachment, error) {
	var attachment model.Attachment
	err := r.db.First(&attachment, id).Error
	return &attachment, err
}

func (r *attachmentRepository) GetByEntity(entityType string, entityID uuid.UUID) ([]model.Attachment, error) {
	var attachments []model.Attachment
	err := r.db.Where("entity_type = ? AND entity_id = ?", entityType, entityID).Find(&attachments).Error
	return attachments, err
}

func (r *attachmentRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Attachment{}, id).Error
}
