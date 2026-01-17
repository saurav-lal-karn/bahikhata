package dto

type CreateExpenseRequest struct {
    Name string `json:"name" binding:"required"`
    Amount float64 `json:"amount" binding:"required"`
	TransactionDate string `json:"transaction_date" binding:"required"`
	Description string `json:"description"`
	PaymentMethodID string `json:"payment_method_id"`
    CategoryID string `json:"category_id"`
	FamilyID string `json:"family_id" binding:"required"`
	IsCustomCategory bool `json:"is_custom_category"`
	IsCustomPaymentMethod bool `json:"is_custom_payment_method"`
	CustomCategoryName string `json:"custom_category_name"`
	CustomPaymentMethodName string `json:"custom_payment_method_name"`
}

type Expense struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Amount float64 `json:"amount"`
	Category string `json:"category"`
	Description string `json:"description"`
	TransactionDate string `json:"transaction_date"`
	PaymentMethod string `json:"payment_method"`
}

type ExpenseStatsResponse struct {
	TotalExpenses int     `json:"total_expenses"`
	TotalAmount   float64 `json:"total_amount"`
	ThisMonth     float64 `json:"this_month"`
	LastMonth     float64 `json:"last_month"`
	AverageExpense float64 `json:"average_expense"`
}
