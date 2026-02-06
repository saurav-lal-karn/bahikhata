package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type DebtRepository interface {
	Create(ctx context.Context, debt *model.Debt) (*model.Debt, error)
	Update(ctx context.Context, id uuid.UUID, debt *model.Debt) (*model.Debt, error)
	List(ctx context.Context, familyID *uuid.UUID, userID *uuid.UUID) ([]model.Debt, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*model.Debt, error)
	
	CreateRepayment(ctx context.Context, repayment *model.DebtRepayment) (*model.DebtRepayment, error)
	ListRepayments(ctx context.Context, debtID uuid.UUID) ([]model.DebtRepayment, error)
	
	CreateSchedules(ctx context.Context, schedules []*model.DebtSchedule) ([]*model.DebtSchedule, error)
	UpdateScheduleStatus(ctx context.Context, id uuid.UUID, status string) (*model.DebtSchedule, error)
	GetScheduleByID(ctx context.Context, id uuid.UUID) (*model.DebtSchedule, error)
	GetAmortizationSchedule(ctx context.Context, debtID uuid.UUID) ([]*model.DebtSchedule, error)
}

type debtRepository struct {
	db *gorm.DB
}

func NewDebtRepository(db *gorm.DB) DebtRepository {
	return &debtRepository{db: db}
}

func (r *debtRepository) Create(ctx context.Context, debt *model.Debt) (*model.Debt, error) {
	if err := r.db.WithContext(ctx).Create(debt).Error; err != nil {
		return nil, err
	}
	return debt, nil
}

func (r *debtRepository) Update(ctx context.Context,id uuid.UUID, debt *model.Debt) (*model.Debt, error) {
	result := r.db.WithContext(ctx).Model(&model.Debt{}).Where("id = ?", id).Updates(debt)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update debt %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return r.GetByID(ctx, id)
}

func (r *debtRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Debt, error) {
	var debt model.Debt
	if err := r.db.WithContext(ctx).Preload("LenderContact").First(&debt, id).Error; err != nil {
		return nil, fmt.Errorf("failed to get debt %s: %w", id, err)
	}
	return &debt, nil
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
	return r.db.WithContext(ctx).Delete(&model.Debt{}, "id = ?", id).Error
}

func (r *debtRepository) CreateRepayment(ctx context.Context, repayment *model.DebtRepayment) (*model.DebtRepayment, error) {
	if err := r.db.WithContext(ctx).Create(repayment).Error; err != nil {
		return nil, fmt.Errorf("failed to create repayment %s: %w", repayment.ID, err)
	}
	return repayment, nil
}

func (r *debtRepository) ListRepayments(ctx context.Context, debtID uuid.UUID) ([]model.DebtRepayment, error) {
	var repayments []model.DebtRepayment
	return repayments, r.db.WithContext(ctx).Preload("Transaction").Where("debt_id = ?", debtID).Order("repayment_date desc").Find(&repayments).Error
}

func (r *debtRepository) CreateSchedules(ctx context.Context, schedules []*model.DebtSchedule) ([]*model.DebtSchedule, error) {
	if err := r.db.WithContext(ctx).Create(&schedules).Error; err != nil {
		return nil, fmt.Errorf("failed to create schedules %s: %w", schedules[0].ID, err)
	}
	return schedules, nil
}

func (r *debtRepository) GetScheduleByID(ctx context.Context, id uuid.UUID) (*model.DebtSchedule, error) {
	var schedule model.DebtSchedule
	if err := r.db.WithContext(ctx).First(&schedule, id).Error; err != nil {
		return nil, fmt.Errorf("failed to get schedule %s: %w", id, err)
	}
	return &schedule, nil
}

func (r *debtRepository) UpdateScheduleStatus(ctx context.Context, id uuid.UUID, status string) (*model.DebtSchedule, error) {
	result := r.db.WithContext(ctx).Model(&model.DebtSchedule{}).Where("id = ?", id).Update("status", status)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to update schedule %s: %w", id, result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return r.GetScheduleByID(ctx, id)
}

func (r *debtRepository) GetAmortizationSchedule(ctx context.Context, debtID uuid.UUID) ([]*model.DebtSchedule, error) {
	var schedules []*model.DebtSchedule
	return schedules, r.db.WithContext(ctx).Where("debt_id = ?", debtID).Order("installment_number ASC").Find(&schedules).Error
}
