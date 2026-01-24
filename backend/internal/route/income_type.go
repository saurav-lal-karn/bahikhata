package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterIncomeTypeRoutes(app *config.Application, router *gin.RouterGroup) {
	incomeTypeRepo := repository.NewIncomeTypeRepository(app.DB)
	incomeTypeService := service.NewIncomeTypeService(incomeTypeRepo)
	incomeTypeController := controller.NewIncomeTypeController(incomeTypeService)

	router.POST("", incomeTypeController.Create)
	router.GET(":family_id", incomeTypeController.List)
}