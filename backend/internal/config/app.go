package config

import (
	"github.com/sauravkarn541/bahikhata/internal/notification"
	"gorm.io/gorm"
)

type Application struct {
	Env *Env
	DB  *gorm.DB
	Hub *notification.Hub
}

func App() Application {
	app := &Application{}
	app.Env = NewEnv()
	app.DB = InitDB(app.Env)
	app.Hub = notification.NewHub()
	go app.Hub.Run()
	// Initialize the global Logrus logger (accessed via GetLogger())
	InitializeLogger()
	return *app
}
