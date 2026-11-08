LOCAL_DATABASE_URL := postgresql://gym:gym@127.0.0.1:5433/gym_tracker

.PHONY: db-up db-down migrate backend-local
db-up:
	docker compose up -d --wait db
	cd backend && DATABASE_URL='$(LOCAL_DATABASE_URL)' DATABASE_URL_UNPOOLED='$(LOCAL_DATABASE_URL)' uv run alembic upgrade head

db-down:
	docker compose stop db

migrate:
	cd backend && uv run alembic upgrade head

backend-local:
	cd backend && DATABASE_URL='$(LOCAL_DATABASE_URL)' DATABASE_URL_UNPOOLED='$(LOCAL_DATABASE_URL)' uv run fastapi dev
