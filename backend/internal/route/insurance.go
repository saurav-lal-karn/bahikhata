package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterInsuranceRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewInsuranceRepository(app.DB)
	svc := service.NewInsuranceService(repo)
	ctrl := controller.NewInsuranceController(svc)

	router.POST("policies", ctrl.CreatePolicy)
	router.GET("policies", ctrl.GetPolicies)
	router.GET("policies/:id", ctrl.GetPolicy)
	router.DELETE("policies/:id", ctrl.DeletePolicy)

	// Premium routes
	router.POST("policies/:id/premiums", ctrl.CreatePremium)
	router.GET("policies/:id/premiums", ctrl.GetPremiums)

	// Claim routes
	router.POST("policies/:id/claims", ctrl.CreateClaim)
	router.GET("policies/:id/claims", ctrl.GetClaims)
}
