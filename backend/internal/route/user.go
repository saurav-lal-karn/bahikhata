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

	rg.GET("/", userCtrl.List)
	rg.GET("/me", userCtrl.GetMe)
	rg.POST("/", userCtrl.Create)
	rg.GET("/:id", userCtrl.GetByID)
	rg.PUT("/:id", userCtrl.Update)
	rg.DELETE("/:id", userCtrl.Delete)
	rg.PUT("/me", userCtrl.UpdateMe)
	rg.POST("/me/avatar", userCtrl.UploadAvatar)
}
