package dto

import "github.com/sauravkarn541/bahikhata/internal/model"

type CreateFamilyRequest struct {
	Name string `json:"name"`
}

type FamilyResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (req *CreateFamilyRequest) ToFamily() *model.Family {
	return &model.Family{
		Name: req.Name,
	}
}