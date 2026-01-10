package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/controller"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

func RegisterFamilyMemberRoutes(app *config.Application, rg *gin.RouterGroup) {

	userRepo := repository.NewUserRepository(app.DB)
	familyRepo := repository.NewFamilyRepository(app.DB)
	familyMemberRepo := repository.NewFamilyMemberRepository(app.DB)
	familyMemberSvc := service.NewFamilyMemberService(familyMemberRepo, userRepo, familyRepo)
	familyMemberCtrl := controller.NewFamilyMemberController(familyMemberSvc)
	

	rg.POST("", familyMemberCtrl.CreateFamilyMember)
	rg.GET(":family_id", familyMemberCtrl.ListFamilyMembers)
}