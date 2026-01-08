package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterFamilyRoutes(app *config.Application, rg *gin.RouterGroup) {
	// Initialize controller, service, repository
	familyRepo := repository.NewFamilyRepository(app.DB)
	familyService := service.NewFamilyService(familyRepo)
	familyController := controller.NewFamilyController(familyService)
	rg.GET("", familyController.ListFamilies)
	rg.POST("", familyController.CreateFamily)
	rg.GET("/:id", familyController.GetFamily)
	rg.PUT("/:id", familyController.UpdateFamily)
	rg.DELETE("/:id", familyController.DeleteFamily)
}	