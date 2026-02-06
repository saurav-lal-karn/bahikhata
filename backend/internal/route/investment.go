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
	router.GET("", ctrl.List)
	router.DELETE(":id", ctrl.Delete)
	router.GET(":id", ctrl.GetByID)
	router.PUT(":id", ctrl.Update)

	router.POST(":id/transactions", ctrl.AddTransaction)
	router.GET(":id/transactions", ctrl.ListTransactions)
	router.GET(":id/valuations", ctrl.ListValuations)
	router.POST(":id/valuations", ctrl.AddValuation)
}
