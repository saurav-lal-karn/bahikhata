package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterSplitRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewSplitRepository(app.DB)
	svc := service.NewSplitService(repo)
	ctrl := controller.NewSplitController(svc)

	router.POST("", ctrl.CreateSplit)
	router.GET("transaction/:tx_id", ctrl.GetSplit)
	router.POST("settle", ctrl.CreateSettlement)
}
