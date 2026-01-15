package controller

import "github.com/sauravkarn541/bahikhata/internal/service"

type ExpenseController struct {
    service service.ExpenseService
}

func NewExpenseController(service service.ExpenseService) *ExpenseController {
    return &ExpenseController{service: service}
}

