package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type UserController struct {
	svc service.UserService
}

func NewUserController(svc service.UserService) *UserController {
	return &UserController{svc: svc}
}

func (ctrl *UserController) CreateUser(c *gin.Context) {
	var req dto.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	user := req.ToUser()

	if err := ctrl.svc.CreateUser(c.Request.Context(), user); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	userResponse := dto.UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
	}

	helper.SuccessResponse(c, http.StatusCreated, "User created successfully", userResponse)
}

func (ctrl *UserController) ListUsers(c *gin.Context) {
	users, err := ctrl.svc.ListUsers(c.Request.Context())
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	var userResponses []dto.UserResponse
	for _, user := range users {
		userResponses = append(userResponses, dto.UserResponse{
			ID:        user.ID,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
		})
	}

	helper.SuccessResponse(c, http.StatusOK, "List Users route called", userResponses)
}

func (ctrl *UserController) GetUser(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	user, err := ctrl.svc.GetUserById(c.Request.Context(), parsedId)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	userResponse := dto.UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
	}

	helper.SuccessResponse(c, http.StatusOK, "Get User route called", userResponse)
}

func (ctrl *UserController) UpdateUser(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Update User route called", nil)
}

func (ctrl *UserController) DeleteUser(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Delete User route called", nil)
}
func (ctrl *UserController) GetMe(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid user ID format in context")
		return
	}

	user, err := ctrl.svc.GetUserById(c.Request.Context(), uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	userResponse := dto.UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		UserName:  user.UserName,
		Role:      user.Role,
		Country:   user.Country,
		AvatarUrl: user.AvatarUrl,
		Theme:     user.Theme,
		Locale:    user.Locale,
		PhoneNumber: user.PhoneNumber,
	}

	helper.SuccessResponse(c, http.StatusOK, "Current user retrieved successfully", userResponse)
}

func(ctrl *UserController) UpdateMe(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid user ID format in context")
		return
	}

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	user := req.ToUser()

	if err := ctrl.svc.UpdateUser(c.Request.Context(), uid, user); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	userResponse := dto.UserResponse{
		ID:        uid,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		UserName:  user.UserName,
		Email:     user.Email,
		Role:      user.Role,
	}

	helper.SuccessResponse(c, http.StatusOK, "Current user updated successfully", userResponse)
}