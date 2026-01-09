package model

type FamilyMember struct {
	ID        string `json:"id"`
	FamilyID  string `json:"family_id"`
	UserID    string `json:"user_id"`
	Role      string `json:"role"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	DeletedAt string `json:"deleted_at"`
}

func (FamilyMember) TableName() string {
	return "family_members"
}
