package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterAIRoutes(app *config.Application, group *gin.RouterGroup) {
	attachmentRepo := repository.NewAttachmentRepository(app.DB)
	aiSvc := service.NewAIService(app.Env, attachmentRepo)
	aiCtrl := controller.NewAIController(aiSvc)

	group.POST("/analyze", aiCtrl.Analyze)
	group.POST("/analyze-expense", aiCtrl.AnalyzeExpense)
	group.GET("/details/:id", aiCtrl.GetDetails)
}
