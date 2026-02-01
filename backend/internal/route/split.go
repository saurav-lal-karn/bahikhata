package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
	"gorm.io/gorm"
)

func RegisterSplitRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewSplitRepository(db)
	svc := service.NewSplitService(repo)
	ctrl := controller.NewSplitController(svc)

	splits := rg.Group("/splits")
	{
		splits.POST("", ctrl.CreateSplit)
		splits.GET("/transaction/:tx_id", ctrl.GetSplit)
		splits.POST("/settle", ctrl.CreateSettlement)
	}
}
