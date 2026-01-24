package controller

import (
	"net/http"

	"fmt"
	"os"
	"path/filepath"
	"time"

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

func (ctrl *UserController) Create(c *gin.Context) {
	var req dto.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}

	user := req.ToUser()

	if err := ctrl.svc.Create(c.Request.Context(), user); err != nil {
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

func (ctrl *UserController) List(c *gin.Context) {
	users, err := ctrl.svc.List(c.Request.Context())
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

func (ctrl *UserController) GetByID(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Invalid ID format")
		return
	}

	user, err := ctrl.svc.GetByID(c.Request.Context(), parsedId)
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

func (ctrl *UserController) Update(c *gin.Context) {
	helper.SuccessResponse(c, http.StatusOK, "Update User route called", nil)
}

func (ctrl *UserController) Delete(c *gin.Context) {
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

	user, err := ctrl.svc.GetByID(c.Request.Context(), uid)
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
		Street:      user.Street,
		City:        user.City,
		State:       user.State,
		PostalCode:  user.PostalCode,
		Family: dto.FamilyResponse{
			ID: user.FamilyMembers[0].Family.ID.String(),
			Name: user.FamilyMembers[0].Family.Name,
			Currency: user.FamilyMembers[0].Family.Currency,
			BudgetAlerts: user.FamilyMembers[0].Family.BudgetAlerts,
			WeeklyReport: user.FamilyMembers[0].Family.WeeklyReport,
			HidePortfolio: user.FamilyMembers[0].Family.HidePortfolio,
			RestrictDeletion: user.FamilyMembers[0].Family.RestrictDeletion,
		},
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

	if err := ctrl.svc.Update(c.Request.Context(), uid, user); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	userResponse := dto.UserResponse{
		ID:        uid,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		UserName:  user.UserName,
		Email:     user.Email,
		Role:        user.Role,
		Country:     user.Country,
		PhoneNumber: user.PhoneNumber,
		AvatarUrl:   user.AvatarUrl,
		Theme:       user.Theme,
		Locale:      user.Locale,
		Street:      user.Street,
		City:        user.City,
		State:       user.State,
		PostalCode:  user.PostalCode,
	}

	helper.SuccessResponse(c, http.StatusOK, "Current user updated successfully", userResponse)
}

func (ctrl *UserController) UploadAvatar(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found in context")
		return
	}

	uid, err := uuid.Parse(userId.(string))
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Invalid user ID format")
		return
	}

	file, err := c.FormFile("avatar")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, "Image file is required")
		return
	}

	// Create upload directory if it doesn't exist
	uploadDir := "./uploads/avatars"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to create upload directory")
		return
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s_%d%s", uid.String(), time.Now().Unix(), ext)
	filepath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, filepath); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to save file")
		return
	}

	// Construct public URL (assuming /uploads is served statically)
	// We store the relative path or absolute URL. Let's store relative path expected by frontend.
	// Frontend likely expects /uploads/avatars/filename
	avatarUrl := fmt.Sprintf("/uploads/avatars/%s", filename)

	// Update user record
	user, err := ctrl.svc.GetByID(c.Request.Context(), uid)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "User not found")
		return
	}

	user.AvatarUrl = avatarUrl
	if err := ctrl.svc.Update(c.Request.Context(), uid, user); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to update user profile")
		return
	}

	helper.SuccessResponse(c, http.StatusOK, "Avatar updated successfully", gin.H{"avatar_url": avatarUrl})
}