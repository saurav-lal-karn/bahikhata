package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterWalletTransferRoutes(app *config.Application, router *gin.RouterGroup){
	walletTransferRepo := repository.NewWalletTransferRepository(app.DB)
	walletRepo := repository.NewWalletRepository(app.DB)
	walletTransferService := service.NewWalletTransferService(walletTransferRepo, walletRepo)
	walletTransferController := controller.NewWalletTransferController(walletTransferService)

	router.POST("", walletTransferController.Create)
	router.GET(":family_id", walletTransferController.List)
}