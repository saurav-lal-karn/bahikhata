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

.PHONY: lint
lint:
	golangci-lint run ./...

.PHONY: format
format:
	go fmt ./...

.PHONY: check
check:
	go test ./... && golangci-lint run ./...
