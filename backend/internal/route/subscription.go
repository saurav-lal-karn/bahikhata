package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
	"gorm.io/gorm"
)

func RegisterSubscriptionRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewSubscriptionRepository(db)
	recurringRepo := repository.NewRecurringTransactionRepository(db)
	svc := service.NewSubscriptionService(repo, recurringRepo)
	ctrl := controller.NewSubscriptionController(svc)

	subs := rg.Group("/subscriptions")
	{
		subs.POST("", ctrl.CreateSubscription)
		subs.GET("", ctrl.GetSubscriptions)
		subs.GET("/:id", ctrl.GetSubscription)
		subs.DELETE("/:id", ctrl.DeleteSubscription)
	}
}
