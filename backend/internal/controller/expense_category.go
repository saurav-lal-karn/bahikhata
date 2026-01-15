package controller

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type ExpenseCategoryController interface {
	GetCategories(ctx *gin.Context) ([]model.ExpenseCategory, error)
	CreateCategory(ctx *gin.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	UpdateCategory(ctx *gin.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	DeleteCategory(ctx *gin.Context, category model.ExpenseCategory) (model.ExpenseCategory, error)
	GetCategoryById(ctx *gin.Context, id string) (model.ExpenseCategory, error)
}

type expenseCategoryController struct {
	service service.ExpenseCategoryService
}

func NewExpenseCategoryController(service service.ExpenseCategoryService) ExpenseCategoryController {
	return &expenseCategoryController{service: service}
}

func (c *expenseCategoryController) GetCategories(ctx *gin.Context) ([]model.ExpenseCategory, error) {
	return c.service.GetCategories(ctx, familyId)
}

func (c *expenseCategoryController) CreateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	return c.service.CreateCategory(ctx, category)
}

func (c *expenseCategoryController) UpdateCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	return c.service.UpdateCategory(ctx, category)
}

func (c *expenseCategoryController) DeleteCategory(ctx context.Context, category model.ExpenseCategory) (model.ExpenseCategory, error) {
	return c.service.DeleteCategory(ctx, category)
}

func (c *expenseCategoryController) GetCategoryById(ctx context.Context, id string) (model.ExpenseCategory, error) {
	return c.service.GetCategoryById(ctx, id)
}