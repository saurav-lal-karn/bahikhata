package worker

import (
	"time"

	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type Worker struct {
	app              *config.Application
	analyticsService service.AnalyticsService
}

func NewWorker(app *config.Application) *Worker {
	txRepo := repository.NewTransactionRepository(app.DB)
	goalRepo := repository.NewGoalRepository(app.DB)
	debtRepo := repository.NewDebtRepository(app.DB)
	investmentRepo := repository.NewInvestmentRepository(app.DB)
	walletRepo := repository.NewWalletRepository(app.DB)

	return &Worker{
		app:              app,
		analyticsService: service.NewAnalyticsService(app.DB, txRepo, goalRepo, debtRepo, investmentRepo, walletRepo),
	}
}

func (w *Worker) Start() {
	// Run once on startup
	w.runAnalyticsJobs()

	// Run every 24 hours
	ticker := time.NewTicker(24 * time.Hour)
	go func() {
		for range ticker.C {
			w.runAnalyticsJobs()
		}
	}()
}

func (w *Worker) runAnalyticsJobs() {
	log := config.GetLogger()
	log.Info("Running background analytics jobs...")

	// In a real scenario, we'd iterate over all active families/users
	// For this MVP, we might want to trigger it globally or per-request
	// Here we just provide the structure.
	
	// Example: Generate snapshots for all families
	// var families []model.Family
	// w.app.DB.Find(&families)
	// for _, f := range families {
	//     w.analyticsService.GenerateNetWorthSnapshot(&f.ID, nil)
	//     w.analyticsService.GenerateMonthlySummary(&f.ID, nil, time.Now())
	// }
}
