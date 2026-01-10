package route

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/helper"
)

func SetupRouter(app *config.Application) *gin.Engine {
	router := gin.New()
	// Setup cors config for api calls
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{app.Env.ClientUrl}
	corsConfig.AllowCredentials = true
	corsConfig.AllowHeaders = []string{"Authorization"}

	// Update router params
	router.Use(gin.Recovery())
	router.Use(cors.New(corsConfig))

	// Test health checkup of backend
	router.GET("/health", func(c *gin.Context) {
		helper.SuccessResponse(c, http.StatusOK, "Backend is up and running", nil)
	})

	// Setup api group
	api := router.Group("api")

	// Register routes
	authRouter := api.Group("/auth")
	RegisterAuthRoutes(app, authRouter)

	userRouter := api.Group("/users")
	RegisterUserRoutes(app, userRouter)

	expenseRouter := api.Group("/expenses")
	RegisterExpenseRoutes(app, expenseRouter)

	familyRouter := api.Group("/families")
	RegisterFamilyRoutes(app, familyRouter)

	familyMemberRouter := api.Group("/family-members")
	RegisterFamilyMemberRoutes(app, familyMemberRouter)

	return router
}
