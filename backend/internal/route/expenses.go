package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
)

func RegisterExpenseRoutes(app *config.Application, rg *gin.RouterGroup) {
	rg.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "List Expenses route called",
		})
	})

	rg.POST("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Create Expense route called",
		})
	})

	rg.GET("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Get Expense route called",
		})
	})

	rg.PUT("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Update Expense route called",
		})
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Delete Expense route called",
		})
	})
}
