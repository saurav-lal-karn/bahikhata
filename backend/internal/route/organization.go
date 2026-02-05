package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterContactRoutes(app *config.Application, router *gin.RouterGroup) {
	contactRepo := repository.NewContactRepository(app.DB)
	contactService := service.NewContactService(contactRepo)
	contactController := controller.NewContactController(contactService)

	router.POST("", contactController.Create)
	router.GET("family/:family_id", contactController.ListByFamilyID)
	router.GET(":id", contactController.GetByID)
	router.PATCH(":id", contactController.Update)
	router.DELETE(":id", contactController.Delete)
}

func RegisterLocationRoutes(app *config.Application, router *gin.RouterGroup) {
	locationRepo := repository.NewLocationRepository(app.DB)
	locationService := service.NewLocationService(locationRepo)
	locationController := controller.NewLocationController(locationService)

	router.POST("", locationController.Create)
	router.GET("family/:family_id", locationController.List)
	router.GET(":id", locationController.GetByID)
	router.PATCH(":id", locationController.Update)
	router.DELETE(":id", locationController.Delete)
}
	
func RegisterTagRoutes(app *config.Application, router *gin.RouterGroup) {
	tagRepo := repository.NewTagRepository(app.DB)
	tagService := service.NewTagService(tagRepo)
	tagController := controller.NewTagController(tagService)

	router.POST("", tagController.Create)
	router.GET("family/:family_id", tagController.List)
	router.GET(":id", tagController.GetByID)
	router.PATCH(":id", tagController.Update)
	router.DELETE(":id", tagController.Delete)
}

func RegisterProjectRoutes(app *config.Application, router *gin.RouterGroup) {
	projectRepo := repository.NewProjectRepository(app.DB)
	projectService := service.NewProjectService(projectRepo)
	projectController := controller.NewProjectController(projectService)

	router.POST("", projectController.Create)
	router.GET("family/:family_id", projectController.List)
	router.GET(":id", projectController.GetByID)
	router.PATCH(":id", projectController.Update)
	router.DELETE(":id", projectController.Delete)
}
