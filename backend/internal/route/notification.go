package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterNotificationRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewNotificationRepository(app.DB)
	svc := service.NewNotificationService(repo, app.Hub)
	ctrl := controller.NewNotificationController(svc)

	router.GET("", ctrl.List)
	router.POST("/mark-all-read", ctrl.MarkAllRead)
	router.PATCH("/:id", ctrl.MarkRead)
}
