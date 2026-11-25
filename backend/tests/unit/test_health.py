from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_serves_html():
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]


def test_db_health_returns_503_when_database_is_down():
    with patch("app.api.routes.health.get_pool", side_effect=RuntimeError("db down")):
        response = client.get("/api/v1/health/db")
    assert response.status_code == 503
    assert response.json() == {"ok": False}
