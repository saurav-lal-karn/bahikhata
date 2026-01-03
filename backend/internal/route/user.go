package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
)

func RegisterUserRoutes(app *config.Application, rg *gin.RouterGroup) {
	rg.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "List Users route called",
		})
	})

	rg.POST("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Create User route called",
		})
	})

	rg.GET("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Get User route called",
		})
	})

	rg.PUT("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Update User route called",
		})
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Delete User route called",
		})
	})
}
