package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterRecurringTransactionRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewRecurringTransactionRepository(app.DB)
	svc := service.NewRecurringTransactionService(repo)
	ctrl := controller.NewRecurringTransactionController(svc)

	router.POST("", ctrl.Create)
	router.GET("", ctrl.GetAll)
	router.DELETE("/:id", ctrl.Delete)
}
