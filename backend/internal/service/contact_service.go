package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type ContactService interface {
	CreateContact(ctx context.Context, req dto.CreateContactRequest) (*dto.ContactResponse, error)
	GetContacts(ctx context.Context, familyID uuid.UUID) ([]dto.ContactResponse, error)
}

type contactService struct {
	repo repository.ContactRepository
}

func NewContactService(repo repository.ContactRepository) ContactService {
	return &contactService{repo: repo}
}

func (s *contactService) CreateContact(ctx context.Context, req dto.CreateContactRequest) (*dto.ContactResponse, error) {
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

func (s *contactService) GetContacts(ctx context.Context, familyID uuid.UUID) ([]dto.ContactResponse, error) {
	contacts, err := s.repo.ListByFamily(ctx, familyID)
	if err != nil {
		return nil, err
	}

	resp := make([]dto.ContactResponse, len(contacts))
	for i, c := range contacts {
		resp[i] = *dto.ToContactResponse(&c)
	}
	return resp, nil
}
