import time

from cryptography.hazmat.primitives.asymmetric import rsa

from tests.conftest import make_token


def auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_missing_token_is_401(client):
    response = client.get("/api/v1/me")
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"


def test_garbage_token_is_401(client):
    assert client.get("/api/v1/me", headers=auth("not-a-jwt")).status_code == 401


def test_expired_token_is_401(client):
    past = int(time.time()) - 3600
    token = make_token(iat=past, nbf=past, exp=past + 60)
    assert client.get("/api/v1/me", headers=auth(token)).status_code == 401


def test_token_signed_by_another_key_is_401(client):
    other = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    assert client.get("/api/v1/me", headers=auth(make_token(key=other))).status_code == 401


def test_token_for_another_frontend_is_401(client):
    token = make_token(azp="https://evil.example")
    assert client.get("/api/v1/me", headers=auth(token)).status_code == 401


def test_public_routes_need_no_token(client):
    assert client.get("/api/v1/items/").status_code == 200


def test_first_request_creates_the_user_once(client, db):
    token = make_token(sub="user_abc", email="ola@example.com")

    first = client.get("/api/v1/me", headers=auth(token))
    second = client.get("/api/v1/me", headers=auth(token))

    assert first.status_code == 200
    assert first.json()["email"] == "ola@example.com"
    assert second.json()["id"] == first.json()["id"]
    assert db.execute("select count(*) from users where clerk_id = 'user_abc'").fetchone()[0] == 1


def test_each_clerk_user_gets_their_own_record(client, db):
    a = client.get("/api/v1/me", headers=auth(make_token(sub="user_a"))).json()
    b = client.get("/api/v1/me", headers=auth(make_token(sub="user_b"))).json()
    assert a["id"] != b["id"]
    assert a["email"] is None  # no email claim and no CLERK_SECRET_KEY in tests
