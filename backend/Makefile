#================================
#== Builds
#================================
migrate:
	go run cmd/migrate/migrate.go

.PHONY: seed
seed:
	go run cmd/seed/seed.go

#================================
#== db migrations
#================================
GOOSE := @goose

.PHONY: goose
goose:
	${GOOSE} -dir ./migrations create ${name} sql