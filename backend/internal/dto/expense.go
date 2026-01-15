package dto

type CreateExpenseRequest struct {
    Name string `json:"name" binding:"required"`
    Amount float64 `json:"amount" binding:"required"`
    Category string `json:"category" binding:"required"`
	Description string `json:"description" binding:"required"`
	Date string `json:"date" binding:"required"`
	PaymentMethod string `json:"payment_method" binding:"required"`
}

type ExpenseResponse struct {
	ID string `json:"id"`
	CreateExpenseRequest
}
