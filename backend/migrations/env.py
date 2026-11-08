from alembic import context
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.pool import NullPool

from app.core.config import settings

database_url = settings.DATABASE_URL_UNPOOLED or settings.DATABASE_URL
if not database_url:
    raise RuntimeError("Set DATABASE_URL or DATABASE_URL_UNPOOLED before migrating.")

url = make_url(database_url).set(drivername="postgresql+psycopg")

if context.is_offline_mode():
    context.configure(url=url, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()
else:
    engine = create_engine(url, poolclass=NullPool)
    with engine.connect() as connection:
        context.configure(connection=connection)
        with context.begin_transaction():
            connection.exec_driver_sql("SELECT pg_advisory_xact_lock(743219861)")
            context.run_migrations()
    engine.dispose()
