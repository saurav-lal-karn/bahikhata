package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
)

func RegisterAttachmentRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewAttachmentRepository(db)
	ctrl := controller.NewAttachmentController(repo)

	attachments := rg.Group("/attachments")
	{
		attachments.POST("", ctrl.Upload)
		attachments.GET("", ctrl.GetByEntity)
		attachments.DELETE("/:id", ctrl.Delete)
	}
}
