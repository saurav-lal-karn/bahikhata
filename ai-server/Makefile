.PHONY: dev start install build

dev:
	poetry run uvicorn app.main:app --reload

start:
	poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000

install:
	poetry install

build:
	docker build -t bahikhata-ai .
