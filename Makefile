DOCKER=sudo docker

ifneq (,$(wildcard ./.env))
    include .env
    export
		ENV_FILE_PARAM = --env-file .env
endif

.PHONY: dev-db
dev-db:
	$(DOCKER) stop feedreader-db || echo "Nothing to stop"
	$(DOCKER) rm feedreader-db || echo "Nothing to remove"
	$(DOCKER) run --name feedreader-db  --network=host $(ENV_FILE_PARAM) -d postgres:16
	sleep 2
	dotenv -f .env run -- npx mikro-orm migration:fresh
