package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type ContactService interface {
	Create(ctx context.Context, req dto.CreateContactRequest) (*dto.ContactResponse, error)
	GetByID(ctx context.Context, id uuid.UUID) (*dto.ContactResponse, error)
	ListByFamilyID(ctx context.Context, familyID uuid.UUID) ([]dto.ContactResponse, error)
	Update(ctx context.Context, id uuid.UUID, req dto.UpdateContactRequest) (*dto.ContactResponse, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type contactService struct {
	repo repository.ContactRepository
}

func NewContactService(repo repository.ContactRepository) ContactService {
	return &contactService{repo: repo}
}

func (s *contactService) Create(ctx context.Context, req dto.CreateContactRequest) (*dto.ContactResponse, error) {
	familyID, err := uuid.Parse(req.FamilyID)
	if err != nil {
		return nil, err
	}

	contact := &model.Contact{
		FamilyID: familyID,
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Address:  req.Address,
		Type:     model.ContactType(req.Type),
	}

	if err := s.repo.Create(ctx, contact); err != nil {
		return nil, err
	}

	return dto.ToContactResponse(contact), nil
}

func (s *contactService) GetByID(ctx context.Context, id uuid.UUID) (*dto.ContactResponse, error) {
	contact, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return dto.ToContactResponse(contact), nil
}

func (s *contactService) ListByFamilyID(ctx context.Context, familyID uuid.UUID) ([]dto.ContactResponse, error) {
	contacts, err := s.repo.ListByFamilyID(ctx, familyID)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.ContactResponse, len(contacts))
	for i, c := range contacts {
		resp[i] = *dto.ToContactResponse(&c)
	}
	return resp, nil
}

func (s *contactService) Update(ctx context.Context, id uuid.UUID, req dto.UpdateContactRequest) (*dto.ContactResponse, error) {
	contact, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		contact.Name = req.Name
	}
	if req.Email != "" {
		contact.Email = req.Email
	}
	if req.Phone != "" {
		contact.Phone = req.Phone
	}
	if req.Address != "" {
		contact.Address = req.Address
	}
	if req.Type != "" {
		contact.Type = model.ContactType(req.Type)
	}
	if req.IsActive != nil {
		contact.IsActive = *req.IsActive
	}

	if err := s.repo.Update(ctx, contact); err != nil {
		return nil, err
	}

	return dto.ToContactResponse(contact), nil
}

func (s *contactService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
