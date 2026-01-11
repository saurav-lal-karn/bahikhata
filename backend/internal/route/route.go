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

	userRouter := protected.Group("/users")
	RegisterUserRoutes(app, userRouter)

	expenseRouter := protected.Group("/expenses")
	RegisterExpenseRoutes(app, expenseRouter)

	familyRouter := protected.Group("/families")
	RegisterFamilyRoutes(app, familyRouter)

	familyMemberRouter := protected.Group("/family-members")
	RegisterFamilyMemberRoutes(app, familyMemberRouter)

	return router
}
