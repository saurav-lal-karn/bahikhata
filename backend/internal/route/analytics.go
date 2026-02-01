package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterAnalyticsRoutes(app *config.Application, rg *gin.RouterGroup) {
	txRepo := repository.NewTransactionRepository(app.DB)
	goalRepo := repository.NewGoalRepository(app.DB)
	debtRepo := repository.NewDebtRepository(app.DB)
	investmentRepo := repository.NewInvestmentRepository(app.DB)
	walletRepo := repository.NewWalletRepository(app.DB)

	analyticsService := service.NewAnalyticsService(txRepo, goalRepo, debtRepo, investmentRepo, walletRepo)
	analyticsController := controller.NewAnalyticsController(analyticsService)

	rg.GET("/dashboard/:family_id", analyticsController.GetDashboardSummary)
	rg.GET("/reports/:family_id", analyticsController.GetReportData)
}
