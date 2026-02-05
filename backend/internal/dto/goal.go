package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

type CreateGoalRequest struct {
	Name string `json:"name" binding:"required"`
	CurrentAmount float64 `json:"current_amount" binding:"required"`
	TargetAmount float64 `json:"target_amount" binding:"required"`
	Description string `json:"description"`
	IconName string `json:"icon_name" binding:"required"`
	Deadline string `json:"deadline" binding:"required"`
	FamilyID uuid.UUID `json:"family_id" binding:"required"`
}


func (req *CreateGoalRequest) ToGoal() (*model.Goal, error) {
	deadline, err := time.Parse(time.RFC3339, req.Deadline)
	if err != nil {
		return nil, err
	}
	return &model.Goal{
		ID: uuid.New(),
		Name:     req.Name,
		CurrentAmount: req.CurrentAmount,
		TargetAmount: req.TargetAmount,
		Description: req.Description,
		IconName: req.IconName,
		Deadline: deadline,
		FamilyID: &req.FamilyID,
	}, nil
}

type AddGoalContributionRequest struct {
	Amount           float64    `json:"amount" binding:"required"`
	TransactionID    *uuid.UUID `json:"transaction_id,omitempty"`
	ContributionDate string     `json:"contribution_date"`
}

func (req *AddGoalContributionRequest) ToModel(goalID uuid.UUID) *model.GoalContribution {
	contributionDate := time.Now()
	if req.ContributionDate != "" {
		if t, err := time.Parse(time.RFC3339, req.ContributionDate); err == nil {
			contributionDate = t
		}
	}
	return &model.GoalContribution{
		ID:               uuid.New(),
		GoalID:           goalID,
		TransactionID:    req.TransactionID,
		Amount:           req.Amount,
		ContributionDate: contributionDate,
	}
}

type UpdateGoalRequest struct {
	Name string `json:"name" binding:"required"`
	CurrentAmount float64 `json:"current_amount" binding:"required"`
	TargetAmount float64 `json:"target_amount" binding:"required"`
	Description string `json:"description"`
	IconName string `json:"icon_name" binding:"required"`
	Deadline string `json:"deadline" binding:"required"`
	FamilyID uuid.UUID `json:"family_id" binding:"required"`
}

func (req *UpdateGoalRequest) ToModel(id uuid.UUID) (*model.Goal, error) {
	deadline, err := time.Parse(time.RFC3339, req.Deadline)
	if err != nil {
		return nil, err
	}
	return &model.Goal{
		ID:            id,
		Name:          req.Name,
		CurrentAmount: req.CurrentAmount,
		TargetAmount:  req.TargetAmount,
		Description:   req.Description,
		IconName:      req.IconName,
		Deadline:      deadline,
		FamilyID:      &req.FamilyID,
	}, nil
}


type GoalResponse struct {
	ID uuid.UUID `json:"id"`
	Name string `json:"name"`
	CurrentAmount float64 `json:"current_amount"`
	TargetAmount float64 `json:"target_amount"`
	Description string `json:"description"`
	IconName string `json:"icon_name"`
	Deadline string `json:"deadline"`
	FamilyID uuid.UUID `json:"family_id"`
}

func ToGoalResponse(goal *model.Goal) *GoalResponse {
	if goal == nil {
		return nil
	}
	return &GoalResponse{
		ID: goal.ID,
		Name: goal.Name,
		CurrentAmount: goal.CurrentAmount,
		TargetAmount: goal.TargetAmount,
		Description: goal.Description,
		IconName: goal.IconName,
		Deadline: goal.Deadline.Format(time.RFC3339),
		FamilyID: *goal.FamilyID,
	}
}