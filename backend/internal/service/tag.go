package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type TagService interface {
	Create(ctx context.Context, req dto.CreateTagRequest) (*dto.TagResponse, error)
	List(ctx context.Context, familyID uuid.UUID) ([]dto.TagResponse, error)
	Update(ctx context.Context, id uuid.UUID, req dto.UpdateTagRequest) (*dto.TagResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*dto.TagResponse, error)
}

type tagService struct {
	tagRepo repository.TagRepository
}

func NewTagService(tagRepo repository.TagRepository) TagService {
	return &tagService{tagRepo: tagRepo}
}

func (t *tagService) Create(ctx context.Context, req dto.CreateTagRequest) (*dto.TagResponse, error) {
	familyID, err := uuid.Parse(req.FamilyID)
	if err != nil {
		return nil, err
	}

	tag := &model.Tag{
		FamilyID: familyID,
		Name:     req.Name,
		Color:    req.Color,
	}

	if err := t.tagRepo.Create(ctx, tag); err != nil {
		return nil, err
	}

	return dto.ToTagResponse(tag), nil
}

func (t *tagService) List(ctx context.Context, familyID uuid.UUID) ([]dto.TagResponse, error) {
	tags, err := t.tagRepo.List(ctx, familyID)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.TagResponse, len(tags))
	for i, t := range tags {
		resp[i] = *dto.ToTagResponse(&t)
	}
	return resp, nil
}

func (t *tagService) Update(ctx context.Context, id uuid.UUID, req dto.UpdateTagRequest) (*dto.TagResponse, error) {
	tag, err := t.tagRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		tag.Name = req.Name
	}
	if req.Color != "" {
		tag.Color = req.Color
	}

	if err := t.tagRepo.Update(ctx, tag); err != nil {
		return nil, err
	}

	return dto.ToTagResponse(tag), nil
}

func (t *tagService) Delete(ctx context.Context, id uuid.UUID) error {
	return t.tagRepo.Delete(ctx, id)
}

func (t *tagService) GetByID(ctx context.Context, id uuid.UUID) (*dto.TagResponse, error) {
	tag, err := t.tagRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return dto.ToTagResponse(tag), nil
}
