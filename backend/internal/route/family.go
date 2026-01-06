package route

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/helper"
)

func RegisterFamilyRoutes(app *config.Application, rg *gin.RouterGroup) {
	rg.GET("", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Family listed successfully", nil)
	})

	rg.POST("", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Family created successfully", nil)
	})

	rg.PUT("/:id", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Family updated successfully", nil)
	})

	rg.DELETE("/:id", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Family deleted successfully", nil)
	})

	rg.GET("/:id", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Family fetched successfully", nil)
	})

	rg.GET("/:id/members", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Family members fetched successfully", nil)
	})
}	