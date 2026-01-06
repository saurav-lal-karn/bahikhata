package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterAuthRoutes(app *config.Application, rg *gin.RouterGroup) {

	userRepo := repository.NewUserRepository(app.DB)
	authSvc := service.NewAuthService(userRepo)
	authCtrl := controller.NewAuthController(authSvc)

	rg.POST("/login", authCtrl.Login)
	rg.POST("/register", authCtrl.Register)
	rg.POST("/logout", authCtrl.Logout)
	rg.GET("/refresh", authCtrl.Refresh)
	rg.POST("/forgot-password", authCtrl.ForgotPassword)
}
