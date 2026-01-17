package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type ExpenseCategoryController struct {
	service service.ExpenseCategoryService
}

func NewExpenseCategoryController(service service.ExpenseCategoryService) ExpenseCategoryController {
	return ExpenseCategoryController{service: service}
}

func (ctrl *ExpenseCategoryController) GetCategories(c *gin.Context) {
	familyId := c.Param("family_id")
	if familyId == "" {
		helper.ErrorResponse(c, http.StatusBadRequest, "family_id is required")
		return
	}

	categories, err := ctrl.service.GetCategories(c.Request.Context(), familyId)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Categories fetched successfully", categories)
}

// func (c *expenseCategoryController) CreateCategory(ctx *gin.Context) (model.ExpenseCategory, error) {
// 	return c.service.CreateCategory(ctx, category)
// }

// func (c *expenseCategoryController) UpdateCategory(ctx *gin.Context) (model.ExpenseCategory, error) {
// 	return c.service.UpdateCategory(ctx, category)
// }

func (ctrl *ExpenseCategoryController) DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		helper.ErrorResponse(c, http.StatusBadRequest, "id is required")
		return
	}

	if err := ctrl.service.DeleteCategory(c.Request.Context(), id); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Category deleted successfully", nil)
}

func (ctrl *ExpenseCategoryController) GetCategoryById(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		helper.ErrorResponse(c, http.StatusBadRequest, "id is required")
		return
	}

	category, err := ctrl.service.GetCategoryById(c.Request.Context(), uuid.MustParse(id))
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Category fetched successfully", category)
}