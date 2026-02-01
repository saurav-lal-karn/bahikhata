package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterContactRoutes(app *config.Application, rg *gin.RouterGroup) {
	contactRepo := repository.NewContactRepository(app.DB)
	contactService := service.NewContactService(contactRepo)
	contactController := controller.NewContactController(contactService)

	contactGroup := rg.Group("/contacts")
	{
		contactGroup.POST("/", contactController.CreateContact)
		contactGroup.GET("/family/:family_id", contactController.GetContacts)
	}
}

func RegisterOrganizationRoutes(app *config.Application, rg *gin.RouterGroup) {
	orgRepo := repository.NewOrganizationRepository(app.DB)
	orgService := service.NewOrganizationService(orgRepo)
	orgController := controller.NewOrganizationController(orgService)

	orgGroup := rg.Group("/org")
	{
		orgGroup.POST("/tags", orgController.CreateTag)
		orgGroup.GET("/tags/family/:family_id", orgController.GetTags)
		orgGroup.POST("/projects", orgController.CreateProject)
		orgGroup.GET("/projects/family/:family_id", orgController.GetProjects)
	}
}
