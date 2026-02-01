package main

import (
	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/route"
	"github.com/sauravkarn541/bahikhata/internal/worker"
)

var log = config.GetLogger()

func main() {
	// Initialize the logger
	config.InitializeLogger()

	app := config.App()
	config.InitJWTParams(app.Env)

	env := app.Env

	router := route.SetupRouter(&app)

	// Start background worker
	w := worker.NewWorker(&app)
	w.Start()

	router.Run(env.AppHost + ":" + env.AppPort)
}
