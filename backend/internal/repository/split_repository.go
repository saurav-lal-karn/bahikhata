package repository

import (
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type SplitRepository interface {
	CreateSplit(split *model.ExpenseSplit) error
	GetSplitByTransactionID(txID uuid.UUID) (*model.ExpenseSplit, error)
	GetSettlementsByParticipant(userID *uuid.UUID, contactID *uuid.UUID) ([]model.SplitSettlement, error)
	CreateSettlement(settlement *model.SplitSettlement) error
}

type splitRepository struct {
	db *gorm.DB
}

func NewSplitRepository(db *gorm.DB) SplitRepository {
	return &splitRepository{db: db}
}

func (r *splitRepository) CreateSplit(split *model.ExpenseSplit) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(split).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *splitRepository) GetSplitByTransactionID(txID uuid.UUID) (*model.ExpenseSplit, error) {
	var split model.ExpenseSplit
	err := r.db.Preload("Participants").Where("transaction_id = ?", txID).First(&split).Error
	return &split, err
}

func (r *splitRepository) GetSettlementsByParticipant(userID *uuid.UUID, contactID *uuid.UUID) ([]model.SplitSettlement, error) {
	var settlements []model.SplitSettlement
	query := r.db
	if userID != nil {
		query = query.Where("participant_user_id = ?", userID)
	} else if contactID != nil {
		query = query.Where("participant_contact_id = ?", contactID)
	}
	err := query.Find(&settlements).Error
	return settlements, err
}

func (r *splitRepository) CreateSettlement(settlement *model.SplitSettlement) error {
	return r.db.Create(settlement).Error
}
