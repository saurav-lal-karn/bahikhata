package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterSubscriptionRoutes(app *config.Application, router *gin.RouterGroup) {
	repo := repository.NewSubscriptionRepository(app.DB)
	recurringRepo := repository.NewRecurringTransactionRepository(app.DB)
	svc := service.NewSubscriptionService(repo, recurringRepo)
	ctrl := controller.NewSubscriptionController(svc)

	router.POST("", ctrl.CreateSubscription)
	router.GET("", ctrl.GetSubscriptions)
	router.GET(":id", ctrl.GetSubscription)
	router.PATCH(":id", ctrl.UpdateSubscription)
	router.DELETE(":id", ctrl.DeleteSubscription)
}
