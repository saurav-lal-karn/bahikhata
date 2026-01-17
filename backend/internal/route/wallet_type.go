package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterWalletTypeRoutes(app *config.Application, router *gin.RouterGroup) {
	walletTypeRepo := repository.NewWalletTypeRepository(app.DB)
	walletTypeService := service.NewWalletTypeService(walletTypeRepo)
	walletTypeController := controller.NewWalletTypeController(walletTypeService)

	router.GET(":family_id", walletTypeController.GetWalletTypes)
	router.POST(":family_id", walletTypeController.CreateWalletType)
}
