package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterWebSocketRoutes(app *config.Application, router *gin.RouterGroup) {
	userRepo := repository.NewUserRepository(app.DB)
	userSvc := service.NewUserService(userRepo)
	ctrl := controller.NewWebSocketController(app.Hub, userSvc)

	router.GET("/ws", ctrl.HandleWS)
}
