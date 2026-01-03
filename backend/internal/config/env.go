package config

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/sauravkarn541/bahikhata/internal/helper"
)

type Env struct {
	// Base application host and port
	AppHost string `mapstructure:"APP_HOST"`
	AppPort string `mapstructure:"APP_PORT"`
	AppMode string `mapstructure:"APP_MODE"`
	AppUrl  string `mapstructure:"APP_URL"`

	// Frontend app url
	ClientUrl string `mapstructure:"CLIENT_URL"`

	// Database configuration
	DBUser     string `mapstructure:"DB_USER"`
	DBPassword string `mapstructure:"DB_PASSWORD"`
	DBName     string `mapstructure:"DB_NAME"`
	DBHostName string `mapstructure:"DB_HOSTNAME"`
	DBPort     string `mapstructure:"DB_PORT"`

	// JWT
	AccessKey     string `mapstructure:"ACCESS_KEY"`
	RefreshKey    string `mapstructure:"REFRESH_KEY"`
	AccessKeyTTL  int    `mapstructure:"ACCESS_KEY_TTL"`
	RefreshKeyTTL int    `mapstructure:"REFRESH_KEY_TTL"`
}

func NewEnv() *Env {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

	return &Env{
		AppHost:       os.Getenv("APP_HOST"),
		AppPort:       os.Getenv("APP_PORT"),
		AppMode:       os.Getenv("APP_MODE"),
		AppUrl:        os.Getenv("APP_URL"),
		ClientUrl:     os.Getenv("CLIENT_URL"),
		DBUser:        os.Getenv("DB_USER"),
		DBPassword:    os.Getenv("DB_PASSWORD"),
		DBName:        os.Getenv("DB_NAME"),
		DBHostName:    os.Getenv("DB_HOSTNAME"),
		DBPort:        os.Getenv("DB_PORT"),
		AccessKey:     os.Getenv("ACCESS_KEY"),
		RefreshKey:    os.Getenv("REFRESH_KEY"),
		AccessKeyTTL:  helper.GetEnvAsInt("ACCESS_KEY_TTL", 3600),
		RefreshKeyTTL: helper.GetEnvAsInt("REFRESH_KEY_TTL", 86400),
	}
}
