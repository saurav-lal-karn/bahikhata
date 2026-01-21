package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterInvestmentRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewInvestmentRepository(app.DB)
	svc := service.NewInvestmentService(repo)
	ctrl := controller.NewInvestmentController(svc)

	router.POST("", ctrl.Create)
	router.GET("", ctrl.GetAll)
	router.DELETE("/:id", ctrl.Delete)
}
