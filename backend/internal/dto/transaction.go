package dto

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
)

// ==================== Request DTOs ====================

// CreateTransactionRequest represents the payload for creating a new transaction.
type CreateTransactionRequest struct {
	Type            model.TransactionCategoryType `json:"type" binding:"required,oneof=INCOME EXPENSE"`
	Amount          float64                       `json:"amount" binding:"required,gt=0"`
	Title           string                        `json:"title" binding:"required,max=255"`
	Description     string                        `json:"description" binding:"max=500"`
	WalletID        string                        `json:"wallet_id" binding:"required,uuid"`
	CategoryID      string                       `json:"category_id" binding:"omitempty,uuid"`
	PaymentMethodID string                       `json:"payment_method_id" binding:"omitempty,uuid"`
	ContactID       string                       `json:"contact_id" binding:"omitempty,uuid"`
	LocationID      string                       `json:"location_id" binding:"omitempty,uuid"`
	ProjectID       string                       `json:"project_id" binding:"omitempty,uuid"`
	TransactionDate time.Time                     `json:"transaction_date" binding:"required"`
	FamilyID        string                        `json:"family_id" binding:"required,uuid"`
	UserID          *string                       `json:"user_id" binding:"omitempty,uuid"`
	Tags            []string                      `json:"tags"`
	Attachments     interface{}                   `json:"attachments"`
	FileID          *string                       `json:"file_id" binding:"omitempty,uuid"`
	Items           []CreateTransactionItemRequest `json:"items"`
	Category        CustomValueCreationPayload     `json:"category" binding:"omitempty"`
	PaymentMethod   CustomValueCreationPayload     `json:"payment_method" binding:"omitempty"`
	Contact         CustomValueCreationPayload     `json:"contact" binding:"omitempty"`
	Location        CustomValueCreationPayload     `json:"location" binding:"omitempty"`
	Project         CustomValueCreationPayload     `json:"project" binding:"omitempty"`
}

// CreateTransactionItemRequest represents an item within a transaction.
type CreateTransactionItemRequest struct {
	Name       string  `json:"name" binding:"required"`
	Amount     float64 `json:"amount" binding:"required"`
	Quantity   float64 `json:"quantity"`
	UnitPrice  float64 `json:"unit_price"`
	CategoryID *string `json:"category_id" binding:"omitempty,uuid"`
}

// ToModel converts CreateTransactionRequest to model.Transaction.
func (r *CreateTransactionRequest) ToModel(creatorID uuid.UUID) (*model.Transaction, error) {
	walletID, err := uuid.Parse(r.WalletID)
	if err != nil {
		return nil, err
	}

	familyID, err := uuid.Parse(r.FamilyID)
	if err != nil {
		return nil, err
	}

	transaction := &model.Transaction{
		Type:            r.Type,
		Amount:          r.Amount,
		Description:     r.Description,
		Title:           r.Title,
		WalletID:        walletID,
		TransactionDate: r.TransactionDate,
		FamilyID:        familyID,
		CreatedByID:     creatorID,
	}

	if r.FileID != nil {
		fileID, err := uuid.Parse(*r.FileID)
		if err == nil {
			transaction.FileID = &fileID
		}
	}

	if r.CategoryID != "" {
		catID, err := uuid.Parse(r.CategoryID)
		if err == nil {
			transaction.CategoryID = &catID
		}
	}

	if r.PaymentMethodID != "" {
		pmID, err := uuid.Parse(r.PaymentMethodID)
		if err == nil {
			transaction.PaymentMethodID = &pmID
		}
	}

	if r.ContactID != "" {
		cID, err := uuid.Parse(r.ContactID)
		if err == nil {
			transaction.ContactID = &cID
		}
	}

	if r.LocationID != "" {
		lID, err := uuid.Parse(r.LocationID)
		if err == nil {
			transaction.LocationID = &lID
		}
	}

	if r.ProjectID != "" {
		pID, err := uuid.Parse(r.ProjectID)
		if err == nil {
			transaction.ProjectID = &pID
		}
	}

	if r.UserID != nil {
		usrID, err := uuid.Parse(*r.UserID)
		if err == nil {
			transaction.UserID = &usrID
		}
	}

	if len(r.Tags) > 0 {
		tags := make([]model.Tag, len(r.Tags))
		for i, tag := range r.Tags {
			tags[i] = model.Tag{
				Name: tag,
			}
		}
		transaction.Tags = tags
	}

	if r.Attachments != nil {
		attachmentsJSON, _ := json.Marshal(r.Attachments)
		transaction.Attachments = model.JSONB(attachmentsJSON)
	}

	if len(r.Items) > 0 {
		transaction.Items = make([]model.TransactionItem, len(r.Items))
		for i, item := range r.Items {
			mItem := model.TransactionItem{
				Name:      item.Name,
				Amount:    item.Amount,
				Quantity:  item.Quantity,
				UnitPrice: item.UnitPrice,
			}
			if item.CategoryID != nil {
				catID, err := uuid.Parse(*item.CategoryID)
				if err == nil {
					mItem.CategoryID = &catID
				}
			}
			transaction.Items[i] = mItem
		}
	}

	return transaction, nil
}

// UpdateTransactionRequest represents the payload for updating an existing transaction.
type UpdateTransactionRequest struct {
	Amount          float64   `json:"amount" binding:"required,gt=0"`
	Description     string    `json:"description" binding:"max=500"`
	Title           string    `json:"title" binding:"required,max=255"`
	WalletID        string    `json:"wallet_id" binding:"required,uuid"`
	CategoryID      *string   `json:"category_id" binding:"omitempty,uuid"`
	PaymentMethodID *string   `json:"payment_method_id" binding:"omitempty,uuid"`
	TransactionDate time.Time `json:"transaction_date" binding:"required"`
	Tags            []string  `json:"tags"`
	Attachments     interface{} `json:"attachments"`
	Items           []CreateTransactionItemRequest `json:"items"`
}

type BulkImportTransactionItemRequest struct {
	Type              model.TransactionCategoryType `json:"type" binding:"required,oneof=INCOME EXPENSE"`
	Amount            float64                       `json:"amount" binding:"required,gt=0"`
	Description       string                        `json:"description" binding:"max=500"`
	Title             string                        `json:"title" binding:"required,max=255"`
	WalletName        string                        `json:"wallet_name" binding:"required"`
	CategoryName      string                        `json:"category_name"`
	PaymentMethodName string                        `json:"payment_method_name"`
	VendorName        string                        `json:"vendor_name"`
	LocationName      string                        `json:"location_name"`
	ProjectName       string                        `json:"project_name"`
	TransactionDate   time.Time                     `json:"transaction_date" binding:"required"`
	FamilyID          string                        `json:"family_id" binding:"required,uuid"`
	Tags              []string                      `json:"tags"`
	Items             []CreateTransactionItemRequest `json:"items"`
}

type BulkImportTransactionsRequest struct {
	Transactions []BulkImportTransactionItemRequest `json:"transactions" binding:"required"`
}

// ==================== Response DTOs ====================

// TransactionResponse represents the API response for a transaction.
type TransactionResponse struct {
	ID                string                       `json:"id"`
	Type              model.TransactionCategoryType `json:"type"`
	Amount            float64                       `json:"amount"`
	Description       string                        `json:"description,omitempty"`
	Title             string                        `json:"title"`
	WalletID          string                        `json:"wallet_id"`
	CategoryID        *string                       `json:"category_id,omitempty"`
	PaymentMethodID   *string                       `json:"payment_method_id,omitempty"`
	ContactID         *string                       `json:"contact_id,omitempty"`
	LocationID        *string                       `json:"location_id,omitempty"`
	ProjectID         *string                       `json:"project_id,omitempty"`
	TransactionDate   string                        `json:"transaction_date"`
	FamilyID          string                        `json:"family_id"`
	UserID            *string                       `json:"user_id,omitempty"`
	CreatedByID       string                        `json:"created_by_id"`
	Tags              []string                      `json:"tags,omitempty"`
	Attachments       interface{}                   `json:"attachments,omitempty"`
	FileID            *string                       `json:"file_id,omitempty"`
	CreatedAt         string                        `json:"created_at"`
	UpdatedAt         string                        `json:"updated_at"`
	
	// Optional: Nested responses
	Wallet        *WalletResponse             `json:"wallet,omitempty"`
	Category      *TransactionCategoryResponse `json:"category,omitempty"`
	PaymentMethod *PaymentMethodResponse      `json:"payment_method,omitempty"`
	Contact       *ContactResponse            `json:"contact,omitempty"`
	Location      *LocationResponse           `json:"location,omitempty"`
	Project       *ProjectResponse            `json:"project,omitempty"`
	Items         []TransactionItemResponse   `json:"items,omitempty"`
}

// TransactionItemResponse represents an item within a transaction response.
type TransactionItemResponse struct {
	ID         string                       `json:"id"`
	Name       string                       `json:"name"`
	Amount     float64                      `json:"amount"`
	Quantity   float64                      `json:"quantity"`
	UnitPrice  float64                      `json:"unit_price"`
	CategoryID *string                      `json:"category_id,omitempty"`
	Category   *TransactionCategoryResponse `json:"category,omitempty"`
}

// TransactionListResponse represents a paginated list of transactions.
type TransactionListResponse struct {
	Transactions []TransactionResponse `json:"transactions"`
	TotalCount   int64                 `json:"total_count"`
	Page         int                   `json:"page"`
	PageSize     int                   `json:"page_size"`
}

// TransactionStatsResponse represents the statistics for transactions.
type TransactionStatsResponse struct {
	TotalCount    int64   `json:"total_count"`
	TotalAmount   float64 `json:"total_amount"`
	ThisMonth     float64 `json:"this_month"`
	LastMonth     float64 `json:"last_month"`
	AverageAmount float64 `json:"average_amount"`
}

// ==================== Mappers ====================

// ToTransactionResponse converts a model.Transaction to TransactionResponse.
// Note: This requires the nested models to be preloaded if they are to be included in the response.
func ToTransactionResponse(m *model.Transaction) *TransactionResponse {
	if m == nil {
		return nil
	}

	resp := &TransactionResponse{
		ID:              m.ID.String(),
		Type:            m.Type,
		Amount:          m.Amount,
		Description:     m.Description,
		Title:           m.Title,
		WalletID:        m.WalletID.String(),
		TransactionDate: m.TransactionDate.Format(time.RFC3339),
		FamilyID:        m.FamilyID.String(),
		CreatedByID:     m.CreatedByID.String(),
		CreatedAt:       m.CreatedAt.Format(time.RFC3339),
		UpdatedAt:       m.UpdatedAt.Format(time.RFC3339),
	}
	
	if m.FileID != nil {
		fileID := m.FileID.String()
		resp.FileID = &fileID
	}

	if m.CategoryID != nil {
		categoryID := m.CategoryID.String()
		resp.CategoryID = &categoryID
	}

	if m.PaymentMethodID != nil {
		pmID := m.PaymentMethodID.String()
		resp.PaymentMethodID = &pmID
	}

	if m.ContactID != nil {
		cID := m.ContactID.String()
		resp.ContactID = &cID
	}

	if m.LocationID != nil {
		lID := m.LocationID.String()
		resp.LocationID = &lID
	}

	if m.ProjectID != nil {
		pID := m.ProjectID.String()
		resp.ProjectID = &pID
	}

	if m.UserID != nil {
		userID := m.UserID.String()
		resp.UserID = &userID
	}

	// Handle Tags (JSONB to []string)
	if m.Tags != nil {
		tags := make([]string, len(m.Tags))
		for i, tag := range m.Tags {
			tags[i] = tag.Name
		}
		resp.Tags = tags
	}

	// Handle Attachments (JSONB to interface{})
	if m.Attachments != nil {
		var attachments interface{}
		_ = json.Unmarshal(m.Attachments, &attachments)
		resp.Attachments = attachments
	}

	// Handle Nested Models if preloaded
	if m.Category != nil {
		resp.Category = ToTransactionCategoryResponse(m.Category)
	}

	if m.PaymentMethod != nil {
		resp.PaymentMethod = ToPaymentMethodResponse(m.PaymentMethod)
	}

	if m.Contact != nil {
		resp.Contact = ToContactResponse(m.Contact)
	}

	if m.Location != nil {
		resp.Location = ToLocationResponse(m.Location)
	}

	if m.Project != nil {
		resp.Project = ToProjectResponse(m.Project)
	}

	if len(m.Items) > 0 {
		resp.Items = make([]TransactionItemResponse, len(m.Items))
		for i, item := range m.Items {
			itemResp := TransactionItemResponse{
				ID:        item.ID.String(),
				Name:      item.Name,
				Amount:    item.Amount,
				Quantity:  item.Quantity,
				UnitPrice: item.UnitPrice,
			}
			if item.CategoryID != nil {
				catID := item.CategoryID.String()
				itemResp.CategoryID = &catID
			}
			if item.Category != nil {
				itemResp.Category = ToTransactionCategoryResponse(item.Category)
			}
			resp.Items[i] = itemResp
		}
	}

	return resp
}

type BulkImportTransactionsResponse struct {
	SuccessCount int                    `json:"success_count"`
	FailedCount  int                    `json:"failed_count"`
	Results      []BulkImportResult `json:"results"`
}

type BulkImportResult struct {
	RowIndex int    `json:"row_index"`
	Success  bool   `json:"success"`
	Error    string `json:"error,omitempty"`
	Data     *TransactionResponse `json:"data,omitempty"`
}