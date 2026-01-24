package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterTaxRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewTaxRepository(app.DB)
	svc := service.NewTaxService(repo)
	ctrl := controller.NewTaxController(svc)

	docs := router.Group("/documents")
	{
		docs.POST("", ctrl.CreateDocument)
		docs.GET("", ctrl.ListDocuments)
		docs.DELETE("/:id", ctrl.DeleteDocument)
	}

	deds := router.Group("/deductions")
	{
		deds.POST("", ctrl.CreateDeduction)
		deds.GET("", ctrl.ListDeductions)
		deds.DELETE("/:id", ctrl.DeleteDeduction)
	}
}
