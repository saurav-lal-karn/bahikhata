package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterPaymentMethodRoutes(app *config.Application, rg *gin.RouterGroup) {
	paymentMethodRepo := repository.NewPaymentMethodRepository(app.DB)
	paymentMethodSvc := service.NewPaymentMethodService(paymentMethodRepo)
	paymentMethodCtrl := controller.NewPaymentMethodController(paymentMethodSvc)

	rg.GET("/:family_id", paymentMethodCtrl.GetPaymentMethods)
}