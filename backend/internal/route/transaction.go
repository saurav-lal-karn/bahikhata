package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterTransactionRoutes(app *config.Application, rg *gin.RouterGroup) {
	txRepo := repository.NewTransactionRepository(app.DB)
	categoryRepo := repository.NewTransactionCategoryRepository(app.DB)
	walletRepo := repository.NewWalletRepository(app.DB)
	paymentRepo := repository.NewPaymentMethodRepository(app.DB)
	familyRepo := repository.NewFamilyRepository(app.DB)

	txService := service.NewTransactionService(txRepo, categoryRepo, walletRepo, paymentRepo, familyRepo, app.DB, config.GetLogger())
	txController := controller.NewTransactionController(txService)

	rg.POST("", txController.Create)
	rg.GET("/:family_id", txController.List)
	rg.GET("/stats/:family_id", txController.GetStats)
	rg.GET("/details/:id", txController.GetByID)
	rg.PUT("/:id", txController.Update)
	rg.DELETE("/:id", txController.Delete)
}
