package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sauravkarn541/bahikhata/internal/helper"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenString string

		// 1. Try to get token from cookie
		accessToken, err := c.Cookie(string(helper.AccessTokenKey))
		if err == nil {
			tokenString = accessToken
		}

		// 2. If not in cookie, try Authorization header
		if tokenString == "" {
			authHeader := c.GetHeader("Authorization")
			if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		// 3. If still not found, try query parameter (useful for WebSockets)
		if tokenString == "" {
			tokenString = c.Query("token")
		}

		if tokenString == "" {
			helper.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized: No token provided")
			c.Abort()
			return
		}

		// 3. Validate token
		claims, err := helper.ValidateAccessToken(tokenString)
		if err != nil {
			helper.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized: Invalid or expired token")
			c.Abort()
			return
		}

		// 4. Set userId in context
		c.Set("userId", claims.UserId)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)

		c.Next()
	}
}
