ifneq (,$(wildcard ./.env))
    include .env
    export
		ENV_FILE_PARAM = --env-file .env
endif

.PHONY: dev-db
dev-db:
	docker stop feedreader-db
	docker rm feedreader-db
	docker run --name feedreader-db  -p $(POSTGRES_PORT):5432 $(ENV_FILE_PARAM) -d postgres
	dotenv -- npx mikro-orm migration:fresh
