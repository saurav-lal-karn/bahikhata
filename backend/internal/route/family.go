package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
)

func RegisterFamilyRoutes(app *config.Application, rg *gin.RouterGroup) {
	rg.GET("", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Family listed successfully",
		})
	})

	rg.POST("", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Family created successfully",
		})
	})

	rg.PUT("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Family updated successfully",
		})
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Family deleted successfully",
		})
	})

	rg.GET("/:id", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Family fetched successfully",
		})
	})

	rg.GET("/:id/members", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Family members fetched successfully",
		})
	})
}	