package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterBudgetRoutes(app *config.Application, router *gin.RouterGroup) {
	budgetRepo := repository.NewBudgetRepository(app.DB)	
	budgetService := service.NewBudgetService(budgetRepo)
	budgetController := controller.NewBudgetController(budgetService)


	router.POST("", budgetController.Create)
	router.GET("family/:family_id", budgetController.List)
	router.GET("alerts", budgetController.GetAlerts)
	router.GET(":id/periods", budgetController.GetPeriods)
	router.POST("alerts/:id/ack", budgetController.AcknowledgeAlert)
	router.PUT(":id", budgetController.Update)
	router.DELETE(":id", budgetController.Delete)
}