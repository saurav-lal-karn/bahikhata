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

	router.POST("", contactController.CreateContact)
	router.GET("family/:family_id", contactController.GetContacts)
	router.GET(":id", contactController.GetContact)
	router.PATCH(":id", contactController.UpdateContact)
	router.DELETE(":id", contactController.DeleteContact)
}

func RegisterOrganizationRoutes(app *config.Application, router *gin.RouterGroup) {
	orgRepo := repository.NewOrganizationRepository(app.DB)
	orgService := service.NewOrganizationService(orgRepo)
	orgController := controller.NewOrganizationController(orgService)

	router.POST("/tags", orgController.CreateTag)
	router.GET("/tags/family/:family_id", orgController.GetTags)
	router.PATCH("/tags/:id", orgController.UpdateTag)
	router.DELETE("/tags/:id", orgController.DeleteTag)

	router.POST("/projects", orgController.CreateProject)
	router.GET("/projects/family/:family_id", orgController.GetProjects)
	router.PATCH("/projects/:id", orgController.UpdateProject)
	router.DELETE("/projects/:id", orgController.DeleteProject)

	router.POST("/locations", orgController.CreateLocation)
	router.GET("/locations/family/:family_id", orgController.GetLocations)
	router.GET("/locations/:id", orgController.GetLocation)
	router.PATCH("/locations/:id", orgController.UpdateLocation)
	router.DELETE("/locations/:id", orgController.DeleteLocation)
}
