package main

import (
	"database/sql"

	_ "github.com/lib/pq"
	"github.com/pressly/goose/v3"
	"github.com/sauravkarn541/bahikhata/internal/config"
)

func main() {
	env := config.NewEnv()
	dsn := config.NewDsn("postgres", env.DBUser, env.DBPassword, env.DBHostName, env.DBPort, env.DBName)

	migrationsDir := "migrations"

	// open db connection
	db, err := sql.Open("postgres", dsn+"?sslmode=disable")
	if err != nil {
		panic(err)
	}

	if err := goose.SetDialect("postgres"); err != nil {
		panic(err)
	}

	// By default, if you attempt to apply missing (out-of-order) migrations goose will raise an error.
	// However, If you want to apply these missing migrations pass goose the -allow-missing flag,
	// or if using as a library supply the functional option goose.WithAllowMissing()
	// to Up, UpTo or UpByOne.
	if err := goose.Up(db, migrationsDir, goose.WithAllowMissing()); err != nil {
		panic(err)
	}

}
