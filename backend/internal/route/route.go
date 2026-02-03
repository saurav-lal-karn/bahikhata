package route

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/middleware"
)

func SetupRouter(app *config.Application) *gin.Engine {
	router := gin.New()
	// Setup cors config for api calls
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{app.Env.ClientUrl}
	corsConfig.AllowCredentials = true
	corsConfig.AllowHeaders = []string{"Authorization", "Content-Type"}

	// Update router params
	router.Use(gin.Recovery())
	router.Use(cors.New(corsConfig))

	// Test health checkup of backend
	router.GET("/health", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Backend is up and running", nil)
	})

	// Setup api group
	api := router.Group("api")

	// Register public routes
	authRouter := api.Group("/auth")
	RegisterAuthRoutes(app, authRouter)

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	protected.Use(middleware.AuditMiddleware(app.DB))

	userRouter := protected.Group("/users")
	RegisterUserRoutes(app, userRouter)

	transactionRouter := protected.Group("/transactions")
	RegisterTransactionRoutes(app, transactionRouter)

	transactionCategoryRouter := protected.Group("/transaction-categories")
	RegisterTransactionCategoryRoutes(app, transactionCategoryRouter)

	familyRouter := protected.Group("/families")
	RegisterFamilyRoutes(app, familyRouter)

	familyMemberRouter := protected.Group("/family-members")
	RegisterFamilyMemberRoutes(app, familyMemberRouter)

	paymentMethodRouter := protected.Group("/payment-methods")
	RegisterPaymentMethodRoutes(app, paymentMethodRouter)

	walletTypeRouter := protected.Group("/wallet-types")
	RegisterWalletTypeRoutes(app, walletTypeRouter)

	walletRouter := protected.Group("/wallets")
	RegisterWalletRoutes(app, walletRouter)

	walletTransferRouter := protected.Group("/wallet-transfers")
	RegisterWalletTransferRoutes(app, walletTransferRouter)

	goalRouter := protected.Group("/goals")
	RegisterGoalRoutes(app, goalRouter)

	budgetRouter := protected.Group("/budgets")
	RegisterBudgetRoutes(app, budgetRouter)

	debtRouter := protected.Group("/debts")
	RegisterDebtRoutes(app, debtRouter)

	investmentRouter := protected.Group("/investments")
	RegisterInvestmentRoutes(app, investmentRouter)

	recurringRouter := protected.Group("/recurring")
	RegisterRecurringTransactionRoutes(app, recurringRouter)

	taxRouter := protected.Group("/tax")
	RegisterTaxRoutes(app, taxRouter)

	notificationRouter := protected.Group("/notifications")
	RegisterNotificationRoutes(app, notificationRouter)

	analyticsRouter := protected.Group("/analytics")
	RegisterAnalyticsRoutes(app, analyticsRouter)

	contactRouter := protected.Group("/contacts")
	RegisterContactRoutes(app, contactRouter)

	organizationRouter := protected.Group("/org")
	RegisterOrganizationRoutes(app, organizationRouter)

	insuranceRouter := protected.Group("/insurance")
	RegisterInsuranceRoutes(app, insuranceRouter)

	subscriptionRouter := protected.Group("/subscriptions")
	RegisterSubscriptionRoutes(app, subscriptionRouter)

	splitRouter := protected.Group("/splits")
	RegisterSplitRoutes(app, splitRouter)

	attachmentRouter := protected.Group("/attachments")
	RegisterAttachmentRoutes(app, attachmentRouter)

	// Serve static files
	router.Static("/uploads", "./uploads")

	return router
}
