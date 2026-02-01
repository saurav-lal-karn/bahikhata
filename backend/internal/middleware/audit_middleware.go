package middleware

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func AuditMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Only log state-changing operations
		if c.Request.Method == http.MethodGet || c.Request.Method == http.MethodHead || c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}

		// Read request body
		var requestBody []byte
		if c.Request.Body != nil {
			requestBody, _ = io.ReadAll(c.Request.Body)
			c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody))
		}

		// Wrap response writer to capture response body
		blw := &bodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = blw

		c.Next()

		// Post-request processing
		if c.Writer.Status() >= 200 && c.Writer.Status() < 300 {
			go func() {
				userIdStr, exists := c.Get("userId")
				if !exists {
					return
				}
				userId, _ := uuid.Parse(userIdStr.(string))

				// In a real implementation, we'd extract familyId from context if available
				// or from the entity being modified. For now, we log what we have.

				auditLog := model.AuditLog{
					UserID:    &userId,
					Action:    c.Request.Method,
					EntityType: c.FullPath(),
					IPAddress: c.ClientIP(),
					UserAgent: c.Request.UserAgent(),
					NewValues: model.JSONB(requestBody),
				}

				// Attempt to extract entity details from response if it's JSON
				var responseMap map[string]interface{}
				if err := json.Unmarshal(blw.body.Bytes(), &responseMap); err == nil {
					if data, ok := responseMap["data"].(map[string]interface{}); ok {
						if idStr, ok := data["id"].(string); ok {
							if id, err := uuid.Parse(idStr); err == nil {
								auditLog.EntityID = &id
							}
						}
					}
				}

				db.Create(&auditLog)
			}()
		}
	}
}
