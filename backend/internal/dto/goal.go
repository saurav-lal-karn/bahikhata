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
