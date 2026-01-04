package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterUserRoutes(app *config.Application, rg *gin.RouterGroup) {
	// Initialize Repository, Service, and Controller
	userRepo := repository.NewUserRepository(app.DB)
	userSvc := service.NewUserService(userRepo)
	userCtrl := controller.NewUserController(userSvc)

	rg.GET("/", userCtrl.ListUsers)
	rg.POST("/", userCtrl.CreateUser)
	rg.GET("/:id", userCtrl.GetUser)
	rg.PUT("/:id", userCtrl.UpdateUser)
	rg.DELETE("/:id", userCtrl.DeleteUser)
}
