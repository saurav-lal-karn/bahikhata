package helper

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func TestJWTFlow(t *testing.T) {
	// Setup params
	JWTParams = JWTParameters{
		AccessKey:     []byte("access-secret"),
		AccessKeyTTL:  15,
		RefreshKey:    []byte("refresh-secret"),
		RefreshKeyTTL: 60,
	}

	claims := MyCustomClaims{
		UserId: "user-123",
		Email:  "test@example.com",
		Role:   "user",
	}

	// 1. Generate Access Token
	accessToken, accessID, err := GetJWT(claims, "access")
	assert.NoError(t, err)
	assert.NotEmpty(t, accessToken)
	assert.NotEmpty(t, accessID)

	// 2. Generate Refresh Token
	refreshToken, refreshID, err := GetJWT(claims, "refresh")
	assert.NoError(t, err)
	assert.NotEmpty(t, refreshToken)
	assert.NotEmpty(t, refreshID)

	// 3. Validate Refresh Token (this is the new logic we want to test)
	decodedClaims, err := ValidateToken(refreshToken)
	assert.NoError(t, err)
	assert.NotNil(t, decodedClaims)
	assert.Equal(t, claims.UserId, decodedClaims.UserId)
	assert.Equal(t, claims.Email, decodedClaims.Email)

	// 4. Try to validate Access Token with ValidateToken (should fail signature check if ValidateToken strictly uses RefreshKey)
	// ValidateToken uses ValidateRefreshJWT which uses RefreshKey.
	// Access token is signed with AccessKey.
	// So validating access token with ValidateToken should fail.
	_, err = ValidateToken(accessToken)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "signature is invalid")
}

func TestValidateToken_Expired(t *testing.T) {
	JWTParams = JWTParameters{
		RefreshKey:    []byte("refresh-secret"),
		RefreshKeyTTL: -1, // Expired immediately
	}

	claims := MyCustomClaims{UserId: "123"}

	// Create a token that is already expired
	// Note: GetJWT sets expiry based on TTL.
	// However, GetJWT uses time.Now(), so we might need to manually create an expired token to be sure,
	// or rely on the negative TTL if GetJWT handles it (it adds minute * TTL).

	// Let's manually create one to be safe and independent of GetJWT implementation details for this edge case
	tokenClaims := JWTClaims{
		MyCustomClaims: claims,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims)
	tokenString, _ := token.SignedString(JWTParams.RefreshKey)

	_, err := ValidateToken(tokenString)
	assert.Error(t, err)
	// The exact error message depends on jwt library, usually "token is expired"
}
