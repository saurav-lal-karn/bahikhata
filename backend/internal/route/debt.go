package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterDebtRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewDebtRepository(app.DB)
	svc := service.NewDebtService(repo)
	ctrl := controller.NewDebtController(svc)

	router.POST("", ctrl.Create)
	router.GET("", ctrl.List)
	router.DELETE("/:id", ctrl.Delete)
}
