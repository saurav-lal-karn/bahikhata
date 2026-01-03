package main

import (
	"log"

	"github.com/sauravkarn541/bahikhata/internal/config"
	"github.com/sauravkarn541/bahikhata/internal/seed"
)

type Seeder struct {
	app config.Application
}

func SeedInit() *Seeder {
	app := config.Application{}
	app.Env = config.NewEnv()
	app.DB = config.InitDB(app.Env)
	return &Seeder{app: app}
}

func (s *Seeder) Seed() {
	seed.SeedBaseData(s.app)
	if s.app.Env.AppMode != "production" {
		seed.SeedDevData(s.app)
	}
}

func main() {
	seeder := SeedInit()
	seeder.Seed()
	log.Print("data seeded successfully")
}
