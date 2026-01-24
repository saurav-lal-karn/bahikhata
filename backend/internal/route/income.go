package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterIncomeRoutes(app *config.Application, router *gin.RouterGroup) {
	incomeRepo := repository.NewIncomeRepository(app.DB)
	walletRepo := repository.NewWalletRepository(app.DB)
	incomeTypeRepo := repository.NewIncomeTypeRepository(app.DB)
	familyRepo := repository.NewFamilyRepository(app.DB)
	incomeService := service.NewIncomeService(incomeRepo, walletRepo, incomeTypeRepo, familyRepo)
	incomeController := controller.NewIncomeController(incomeService)

	router.POST("", incomeController.Create)
	router.GET("details/:id", incomeController.GetByID)
	router.GET("/:familyId", incomeController.List)
	router.PUT("/:id", incomeController.Update)
	router.DELETE("/:id", incomeController.Delete)
	router.GET("/stats", incomeController.GetStats)
}