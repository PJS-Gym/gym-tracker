from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine, pool
from sqlalchemy.engine import URL, make_url

from app.core.config import settings

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Migrations are hand-written SQL, so there is no model metadata to compare against.
target_metadata = None


def get_url() -> URL:
    """Return the DATABASE_URL from .env.local, using the psycopg driver."""
    if not settings.DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not set. Run `neon env pull` in the repo root.")
    return make_url(settings.DATABASE_URL).set(drivername="postgresql+psycopg")


def run_migrations_offline() -> None:
    """Print the migration SQL instead of running it (`alembic upgrade head --sql`)."""
    context.configure(
        url=get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run the migrations against the database."""
    connectable = create_engine(
        get_url(),
        poolclass=pool.NullPool,
        # Same as app/core/db.py: Neon's pooler doesn't keep prepared statements.
        connect_args={"prepare_threshold": None},
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
