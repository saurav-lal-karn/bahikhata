package controller

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/helper"
	"github.com/sauravkarn541/bahikhata/internal/service"
)

// getUserIDFromContext extracts and validates user ID from gin context
func getUserIDFromContext(c *gin.Context) (uuid.UUID, error) {
	userID, exists := c.Get("userId")
	if !exists {
		return uuid.Nil, errors.New("user ID not found in context")
	}

	uid, err := uuid.Parse(userID.(string))
	if err != nil {
		return uuid.Nil, errors.New("invalid user ID format")
	}

	return uid, nil
}

// parseUUIDParam extracts and validates UUID from URL parameter
func parseUUIDParam(c *gin.Context, paramName string) (uuid.UUID, error) {
	paramValue := c.Param(paramName)
	if paramValue == "" {
		return uuid.Nil, errors.New(paramName + " is required")
	}

	id, err := uuid.Parse(paramValue)
	if err != nil {
		return uuid.Nil, errors.New("invalid " + paramName + " format")
	}

	return id, nil
}

// parseUUIDQuery extracts and validates UUID from URL query parameter
func parseUUIDQuery(c *gin.Context, paramName string) (uuid.UUID, error) {
	paramValue := c.Query(paramName)
	if paramValue == "" {
		return uuid.Nil, errors.New(paramName + " is required")
	}

	id, err := uuid.Parse(paramValue)
	if err != nil {
		return uuid.Nil, errors.New("invalid " + paramName + " format")
	}

	return id, nil
}

// handleServiceError maps service errors to appropriate HTTP responses
func handleServiceError(c *gin.Context, err error) {
	var svcErr *service.ServiceError
	if errors.As(err, &svcErr) {
		switch svcErr.Type {
		case service.ErrNotFound:
			helper.ErrorResponse(c, http.StatusNotFound, svcErr.Message)
		case service.ErrUnauthorized:
			helper.ErrorResponse(c, http.StatusForbidden, svcErr.Message)
		case service.ErrValidation:
			helper.ErrorResponse(c, http.StatusBadRequest, svcErr.Message)
		case service.ErrConflict:
			helper.ErrorResponse(c, http.StatusConflict, svcErr.Message)
		default:
			helper.ErrorResponse(c, http.StatusInternalServerError, "internal server error")
		}
		return
	}
	
	// Generic error
	helper.ErrorResponse(c, http.StatusInternalServerError, "internal server error")
}
