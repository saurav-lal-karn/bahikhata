package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type UserController struct {
	svc service.UserService
}

func NewUserController(svc service.UserService) *UserController {
	return &UserController{svc: svc}
}

func (ctrl *UserController) CreateUser(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.svc.CreateUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "user": user})
}

func (ctrl *UserController) ListUsers(c *gin.Context) {
	users, err := ctrl.svc.ListUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "List Users route called", "users": users})
}

func (ctrl *UserController) GetUser(c *gin.Context) {
	id := c.Param("id")
	parsedId, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	
	user, err := ctrl.svc.GetUserById(parsedId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Get User route called", "user": user})
}

func (ctrl *UserController) UpdateUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Update User route called"})
}

func (ctrl *UserController) DeleteUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Delete User route called"})
}
