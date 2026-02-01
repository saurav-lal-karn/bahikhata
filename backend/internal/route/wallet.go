package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

// RegisterWalletRoutes registers all wallet-related routes.
//
// Routes:
//   - GET    /family/:family_id  - List wallets for a family (with pagination)
//   - POST   /                   - Create a new wallet
//   - GET    /:wallet_id         - Get wallet by ID
//   - PUT    /:wallet_id         - Update wallet
//   - DELETE /:wallet_id         - Delete wallet
func RegisterWalletRoutes(app *config.Application, router *gin.RouterGroup) {
	// Use the existing Logrus logger from config
	logger := config.GetLogger()

	// Initialize repositories
	walletRepo := repository.NewWalletRepository(app.DB)
	walletTypeRepo := repository.NewWalletTypeRepository(app.DB)
	familyRepo := repository.NewFamilyRepository(app.DB)

	// Initialize service with dependencies
	walletService := service.NewWalletService(walletRepo, walletTypeRepo, familyRepo, logger)

	// Initialize controller
	walletController := controller.NewWalletController(walletService)

	// Register routes
	// List wallets for a family (with pagination support)
	router.GET("/family/:family_id", walletController.List)

	// Create a new wallet
	router.POST("", walletController.Create)

	// Get wallet by ID
	router.GET("/:wallet_id", walletController.GetByID)

	// Update wallet
	router.PUT("/:wallet_id", walletController.Update)

	// Delete wallet
	router.DELETE("/:wallet_id", walletController.Delete)
}
