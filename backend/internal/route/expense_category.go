package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterExpenseCategoryRoutes(app *config.Application, rg *gin.RouterGroup) {
	expenseCategoryRepo := repository.NewExpenseCategoryRepository(app.DB)
	expenseCategorySvc := service.NewExpenseCategoryService(expenseCategoryRepo)
	expenseCategoryCtrl := controller.NewExpenseCategoryController(expenseCategorySvc)

	rg.GET("/:family_id", expenseCategoryCtrl.List)
	rg.DELETE("/:id", expenseCategoryCtrl.Delete)
}