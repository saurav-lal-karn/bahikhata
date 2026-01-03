package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
)

func RegisterAuthRoutes(app *config.Application, rg *gin.RouterGroup) {
	rg.POST("/login", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Login route called",
		})
	})

	rg.POST("/register", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Register route called",
		})
	})

	rg.POST("/logout", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Logout route called",
		})
	})

	rg.GET("/refresh", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Refresh route called",
		})
	})

	rg.POST("/forgot-password", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Forgot Password route called",
		})
	})
}
