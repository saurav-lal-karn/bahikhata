package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterWalletRoutes(app *config.Application, router *gin.RouterGroup) {
	walletRepo := repository.NewWalletRepository(app.DB)
	walletTypeRepo := repository.NewWalletTypeRepository(app.DB)
	familyRepo := repository.NewFamilyRepository(app.DB)
	walletService := service.NewWalletService(walletRepo, walletTypeRepo, familyRepo)
	walletController := controller.NewWalletController(walletService)

	router.GET("/family/:family_id", walletController.GetWallets)
	router.POST("", walletController.CreateWallet)
	router.GET(":wallet_id", walletController.GetWalletDetails)
	router.PUT(":wallet_id", walletController.UpdateWallet)
	router.DELETE(":wallet_id", walletController.DeleteWallet)
}