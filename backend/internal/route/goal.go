package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterGoalRoutes(app *config.Application, router *gin.RouterGroup) {
    goalRepo := repository.NewGoalRepository(app.DB)
    goalService := service.NewGoalService(goalRepo)
	goalController := controller.NewGoalController(goalService)

	router.POST("", goalController.Create)
	router.GET("", goalController.List)
	router.POST("/:id/contributions", goalController.AddContribution)
	router.GET("/:id/contributions", goalController.ListContributions)
	router.PUT("/:id", goalController.Update)
	router.DELETE("/:id", goalController.Delete)
}