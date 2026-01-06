package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type AuthController struct {
	svc service.AuthService
}

func NewAuthController(svc service.AuthService) *AuthController {
	return &AuthController{svc: svc}
}

func(a *AuthController) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	jwtTokens, err := a.svc.Login(req.Email, req.Password)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	helper.SetCookies(c, jwtTokens.AccessJWT, jwtTokens.RefreshJWT)
	loginResponse := dto.LoginResponse{
		AccessToken: jwtTokens.AccessJWT,
		RefreshToken: jwtTokens.RefreshJWT,
	}

	helper.SuccessResponse(c, http.StatusOK, "Login successful", loginResponse)
}

func(a *AuthController) Register(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Register route called", nil)
}

func(a *AuthController) Logout(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Logout route called", nil)
}

func(a *AuthController) Refresh(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Refresh route called", nil)
}

func(a *AuthController) ForgotPassword(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Forgot Password route called", nil)
}
