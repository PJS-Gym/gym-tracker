import os
import time
from pathlib import Path

import jwt
from alembic import command
from alembic.config import Config
import psycopg
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient

from app.api.deps import get_db
from app.core.config import settings
from app.main import app

FRONTEND = "http://localhost:3000"
ALEMBIC_INI = Path(__file__).resolve().parents[1] / "alembic.ini"

_private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
_public_pem = (
    _private_key.public_key()
    .public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo)
    .decode()
)


def make_token(sub: str = "user_123", key=None, **overrides) -> str:
    """A Clerk-shaped session token signed with the test key (or `key`)."""
    now = int(time.time())
    claims = {"sub": sub, "iat": now, "nbf": now, "exp": now + 60, "azp": FRONTEND, **overrides}
    return jwt.encode(claims, key or _private_key, algorithm="RS256")


@pytest.fixture(autouse=True)
def clerk_settings(monkeypatch):
    monkeypatch.setattr(settings, "CLERK_JWT_KEY", _public_pem)
    monkeypatch.setattr(settings, "CLERK_JWKS_URL", None)
    monkeypatch.setattr(settings, "CLERK_AUTHORIZED_PARTIES", [FRONTEND])
    monkeypatch.setattr(settings, "CLERK_SECRET_KEY", None)


@pytest.fixture
def client():
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture(scope="session")
def migrated_url():
    """TEST_DATABASE_URL brought up to the latest migration, once per run."""
    url = os.environ.get("TEST_DATABASE_URL")
    if not url:
        pytest.skip("TEST_DATABASE_URL is not set")
    database_url = settings.DATABASE_URL
    settings.DATABASE_URL = url
    try:
        command.upgrade(Config(str(ALEMBIC_INI)), "head")
    finally:
        settings.DATABASE_URL = database_url
    return url


@pytest.fixture
def db(migrated_url):
    """Clean tables in TEST_DATABASE_URL. Tests that need it are skipped without one."""
    with psycopg.connect(migrated_url, autocommit=True) as conn:
        # Row by row, so ON DELETE CASCADE removes what users own and shared exercises stay:
        # TRUNCATE ... CASCADE would empty every table that refers to users, exercises included.
        conn.execute("DELETE FROM users")

        def override():
            yield conn

        app.dependency_overrides[get_db] = override
        yield conn
