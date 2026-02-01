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
