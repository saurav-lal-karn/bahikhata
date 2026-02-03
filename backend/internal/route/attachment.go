package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

func RegisterAttachmentRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewAttachmentRepository(app.DB)
	ctrl := controller.NewAttachmentController(repo)

	router.POST("", ctrl.Upload)
	router.GET("", ctrl.GetByEntity)
	router.DELETE(":id", ctrl.Delete)
}
