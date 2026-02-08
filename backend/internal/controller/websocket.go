package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/sauravkarn541/bahikhata/internal/notification"
	"github.com/sauravkarn541/bahikhata/internal/service"
	"github.com/sirupsen/logrus"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // In production, check against settings.ClientUrl
	},
}

type WebSocketController struct {
	hub     *notification.Hub
	userSvc service.UserService
}

func NewWebSocketController(hub *notification.Hub, userSvc service.UserService) *WebSocketController {
	return &WebSocketController{
		hub:     hub,
		userSvc: userSvc,
	}
}

func (ctrl *WebSocketController) HandleWS(c *gin.Context) {
	userIdStr, exists := c.Get("userId")
	if !exists {
		logrus.Warn("WebSocket attempt without userId in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	uid, err := uuid.Parse(userIdStr.(string))
	if err != nil {
		logrus.Errorf("Invalid userId in context: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	// Fetch user to get familyId
	user, err := ctrl.userSvc.GetByID(c.Request.Context(), uid)
	if err != nil {
		logrus.Errorf("Error fetching user for WS: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user info"})
		return
	}

	var familyId uuid.UUID
	if len(user.FamilyMembers) > 0 {
		familyId = user.FamilyMembers[0].FamilyID
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		logrus.Errorf("Error upgrading to WebSocket: %v", err)
		return
	}

	client := &notification.Client{
		Hub:      ctrl.hub,
		Conn:     conn,
		UserID:   uid,
		FamilyID: familyId,
		Send:     make(chan []byte, 256),
	}
	client.Hub.Register(client)

	// Start pumps
	go client.WritePump()
	go client.ReadPump()
}
