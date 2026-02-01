package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterTransactionCategoryRoutes(app *config.Application, rg *gin.RouterGroup) {
	categoryRepo := repository.NewTransactionCategoryRepository(app.DB)
	familyRepo := repository.NewFamilyRepository(app.DB)

	categoryService := service.NewTransactionCategoryService(categoryRepo, familyRepo, config.GetLogger())
	categoryController := controller.NewTransactionCategoryController(categoryService)

	rg.POST("", categoryController.Create)
	rg.GET("/:family_id", categoryController.List)
	rg.GET("/details/:id", categoryController.GetByID)
	rg.PUT("/:id", categoryController.Update)
	rg.DELETE("/:id", categoryController.Delete)
}
