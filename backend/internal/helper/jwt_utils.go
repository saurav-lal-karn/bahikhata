package helper

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// JWTPayload ...
type JWTPayload struct {
	AccessJWT  string `json:"accessJWT,omitempty"`
	RefreshJWT string `json:"refreshJWT,omitempty"`
}

// JWTParameters - params to configure JWT
type JWTParameters struct {
	AccessKey     []byte
	AccessKeyTTL  int
	RefreshKey    []byte
	RefreshKeyTTL int
}

// JWTParams - exported variables
var JWTParams JWTParameters

// MyCustomClaims ...
type MyCustomClaims struct {
	UserId  string `json:"userId,omitempty"`
	Email   string `json:"email,omitempty"`
	Role    string `json:"role,omitempty"`
}

// JWTClaims ...
type JWTClaims struct {
	MyCustomClaims
	jwt.RegisteredClaims
}

// ValidateAccessJWT ...
func ValidateAccessJWT(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
	}
	return JWTParams.AccessKey, nil
}

// ValidateRefreshJWT ...
func ValidateRefreshJWT(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
	}
	return JWTParams.RefreshKey, nil
}

// GetJWT - issue new tokens
func GetJWT(customClaims MyCustomClaims, tokenType string) (string, string, error) {
	var (
		key []byte
		ttl int
	)

	if tokenType == "access" {
		key = JWTParams.AccessKey
		ttl = JWTParams.AccessKeyTTL
	}
	if tokenType == "refresh" {
		key = JWTParams.RefreshKey
		ttl = JWTParams.RefreshKeyTTL
	}
	// Create the Claims
	claims := JWTClaims{
		MyCustomClaims{
			UserId:  customClaims.UserId,
			Email:   customClaims.Email,
			Role:    customClaims.Role,
		},
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * time.Duration(ttl))),
			ID:        uuid.NewString(),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	jwtValue, err := token.SignedString(key)
	if err != nil {
		return "", "", err
	}
	return jwtValue, claims.ID, nil
}

type CookieKey string

const (
	AccessTokenKey  CookieKey = "access_token"
	RefreshTokenKey CookieKey = "refresh_token"
)

// Set HttpOnly cookies with secure flag if using HTTPS
func SetCookies(c *gin.Context, accessToken string, refreshToken string) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     string(AccessTokenKey),
		Value:    accessToken,
		Expires:  time.Now().Add(time.Minute * time.Duration(JWTParams.AccessKeyTTL)),
		HttpOnly: true,
		Secure:   c.Request.TLS != nil,
		Path:     "/",
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     string(RefreshTokenKey),
		Value:    refreshToken,
		Expires:  time.Now().Add(time.Minute * time.Duration(JWTParams.RefreshKeyTTL)),
		HttpOnly: true,
		Secure:   c.Request.TLS != nil,
		Path:     "/",
	})
}

// Clear HttpOnly cookies with secure flag if using HTTPS
func ClearCookies(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     string(AccessTokenKey),
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   c.Request.TLS != nil,
		Path:     "/",
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     string(RefreshTokenKey),
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   c.Request.TLS != nil,
		Path:     "/",
	})
}

type ContextKey string

const (
	DatabaseKey ContextKey = "database"
)
