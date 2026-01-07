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
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	user, err := a.svc.Register(req.FirstName, req.LastName, req.Email, req.Password)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Register successful", user)
}

func(a *AuthController) Logout(c *gin.Context) {
	var req dto.LogoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Logout route called", nil)
}

func(a *AuthController) Refresh(c *gin.Context) {
	var req dto.RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	jwtTokens, err := a.svc.Refresh(req.RefreshToken)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	helper.SetCookies(c, jwtTokens.AccessJWT, jwtTokens.RefreshJWT)
	refreshResponse := dto.RefreshResponse{
		AccessToken:  jwtTokens.AccessJWT,
		RefreshToken: jwtTokens.RefreshJWT,
	}

	helper.SuccessResponse(c, http.StatusOK, "Refresh successful", refreshResponse)
}

func(a *AuthController) ForgotPassword(c *gin.Context) {
	var req dto.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Forgot Password route called", nil)
}
