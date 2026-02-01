package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
	"gorm.io/gorm"
)

func RegisterInsuranceRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewInsuranceRepository(db)
	svc := service.NewInsuranceService(repo)
	ctrl := controller.NewInsuranceController(svc)

	insurance := rg.Group("/insurance")
	{
		insurance.POST("", ctrl.CreatePolicy)
		insurance.GET("", ctrl.GetPolicies)
		insurance.GET("/:id", ctrl.GetPolicy)
		insurance.DELETE("/:id", ctrl.DeletePolicy)
	}
}
