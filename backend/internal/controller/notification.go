package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

type NotificationController struct {
	svc service.NotificationService
}

func NewNotificationController(svc service.NotificationService) *NotificationController {
	return &NotificationController{svc: svc}
}

// List returns notifications for the current user (optionally filtered by family_id, status).
// GET /notifications?family_id=...&status=unread&limit=20
func (nc *NotificationController) List(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found")
		return
	}

	var familyID *uuid.UUID
	if fidStr := c.Query("family_id"); fidStr != "" {
		if fid, err := uuid.Parse(fidStr); err == nil {
			familyID = &fid
		}
	}
	var status *string
	if s := c.Query("status"); s != "" {
		status = &s
	}
	limit := 50
	if l := c.Query("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil && n > 0 {
			limit = n
		}
	}

	list, err := nc.svc.List(c.Request.Context(), uid, familyID, status, limit)
	if err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch notifications")
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Notifications retrieved successfully", list)
}

// MarkRead updates a single notification's status (e.g. PATCH /notifications/:id with body {"status": "read"}).
func (nc *NotificationController) MarkRead(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found")
		return
	}
	id, err := parseUUIDParam(c, "id")
	if err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	var req struct {
		Status string `json:"status" binding:"required,oneof=read unread"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
		return
	}
	if err := nc.svc.MarkRead(c.Request.Context(), id, uid, req.Status); err != nil {
		if svcErr, ok := err.(*service.ServiceError); ok && svcErr.Type == service.ErrUnauthorized {
			helper.ErrorResponse(c, http.StatusForbidden, svcErr.Message)
			return
		}
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to update notification")
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "Notification updated successfully", nil)
}

// MarkAllRead marks all notifications for the user (optionally in a family) as read.
// POST /notifications/mark-all-read with optional body {"family_id": "..."}
func (nc *NotificationController) MarkAllRead(c *gin.Context) {
	uid, err := getUserIDFromContext(c)
	if err != nil {
		helper.ErrorResponse(c, http.StatusUnauthorized, "User ID not found")
		return
	}
	var familyID *uuid.UUID
	var body struct {
		FamilyID string `json:"family_id"`
	}
	_ = c.ShouldBindJSON(&body)
	if body.FamilyID != "" {
		if fid, err := uuid.Parse(body.FamilyID); err == nil {
			familyID = &fid
		}
	}
	if err := nc.svc.MarkAllRead(c.Request.Context(), uid, familyID); err != nil {
		helper.ErrorResponse(c, http.StatusInternalServerError, "Failed to mark notifications read")
		return
	}
	helper.SuccessResponse(c, http.StatusOK, "All notifications marked as read", nil)
}
