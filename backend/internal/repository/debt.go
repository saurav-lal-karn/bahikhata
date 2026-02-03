package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type DebtRepository interface {
	Create(ctx context.Context, debt *model.Debt) error
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error)
	Delete(ctx context.Context, id uuid.UUID) error
	CreateRepayment(ctx context.Context, repayment *model.DebtRepayment) error
	ListRepayments(ctx context.Context, debtID uuid.UUID) ([]model.DebtRepayment, error)
	CreateSchedules(ctx context.Context, schedules []model.DebtSchedule) error
	UpdateScheduleStatus(ctx context.Context, id uuid.UUID, status string) error
	GetAmortizationSchedule(ctx context.Context, debtID uuid.UUID) ([]model.DebtSchedule, error)
}

type debtRepository struct {
	db *gorm.DB
}

func NewDebtRepository(db *gorm.DB) DebtRepository {
	return &debtRepository{db: db}
}

func (r *debtRepository) Create(ctx context.Context, debt *model.Debt) error {
	return r.db.WithContext(ctx).Create(debt).Error
}

func (r *debtRepository) List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error) {
	var debts []model.Debt
	query := r.db.WithContext(ctx)

	if familyID != nil {
		query = query.Where("family_id = ?", familyID)
	}
	if userID != nil {
		query = query.Where("user_id = ?", userID)
	}

	if err := query.Preload("LenderContact").Find(&debts).Error; err != nil {
		return nil, err
	}
	return debts, nil
}

func (r *debtRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&model.Debt{}, id).Error
}

func (r *debtRepository) CreateRepayment(ctx context.Context, repayment *model.DebtRepayment) error {
	return r.db.WithContext(ctx).Create(repayment).Error
}

func (r *debtRepository) ListRepayments(ctx context.Context, debtID uuid.UUID) ([]model.DebtRepayment, error) {
	var repayments []model.DebtRepayment
	return repayments, r.db.WithContext(ctx).Preload("Transaction").Where("debt_id = ?", debtID).Order("repayment_date desc").Find(&repayments).Error
}

func (r *debtRepository) CreateSchedules(ctx context.Context, schedules []model.DebtSchedule) error {
	return r.db.WithContext(ctx).Create(&schedules).Error
}

func (r *debtRepository) UpdateScheduleStatus(ctx context.Context, id uuid.UUID, status string) error {
	return r.db.WithContext(ctx).Model(&model.DebtSchedule{}).Where("id = ?", id).Update("status", status).Error
}

func (r *debtRepository) GetAmortizationSchedule(ctx context.Context, debtID uuid.UUID) ([]model.DebtSchedule, error) {
	var schedules []model.DebtSchedule
	return schedules, r.db.WithContext(ctx).Where("debt_id = ?", debtID).Order("installment_number ASC").Find(&schedules).Error
}
