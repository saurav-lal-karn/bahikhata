package helper

import (
	"log"
	"os"
	"strconv"
)

// Helper function to convert string to int
func GetEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		log.Printf("Error converting %s to int: %v", key, err)
		return defaultValue
	}
	return value
}
