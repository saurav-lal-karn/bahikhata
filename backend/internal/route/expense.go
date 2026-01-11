package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/helper"
)

func RegisterExpenseRoutes(app *config.Application, rg *gin.RouterGroup) {
	rg.GET("/", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "List Expenses route called", nil)
	})

	rg.POST("/", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Create Expense route called", nil)
	})

	rg.GET("/:id", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Get Expense route called", nil)
	})

	rg.PUT("/:id", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Update Expense route called", nil)
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Delete Expense route called", nil)
	})
}
