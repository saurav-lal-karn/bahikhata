package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterExpenseRoutes(app *config.Application, rg *gin.RouterGroup) {
	expenseRepo := repository.NewExpenseRepository(app.DB)
	paymentMethodRepo := repository.NewPaymentMethodRepository(app.DB)
	categoryRepo := repository.NewExpenseCategoryRepository(app.DB)
	familyRepo := repository.NewFamilyRepository(app.DB)
	
	expenseSvc := service.NewExpenseService(expenseRepo, paymentMethodRepo, categoryRepo, familyRepo)
	expenseCtrl := controller.NewExpenseController(expenseSvc)

	// Routes for expenses
	rg.POST("", expenseCtrl.Create)
	rg.GET("/:family_id", expenseCtrl.List)
	rg.GET("/stats/:family_id", expenseCtrl.GetStats)
}
