from datetime import date, timedelta

import pytest

from tests.conftest import make_token

HEADERS = {"Authorization": f"Bearer {make_token(sub='user_ola')}"}
TODAY = date.today()


def years_ago(years: int, days: int = 0) -> str:
    return (TODAY.replace(year=TODAY.year - years) + timedelta(days=days)).isoformat()


def onboard(client, **body):
    return client.post("/api/v1/me/onboarding", json=body, headers=HEADERS)


def test_profile_routes_need_a_token(client):
    assert client.get("/api/v1/me/profile").status_code == 401
    assert client.post("/api/v1/me/onboarding", json={}).status_code == 401
    assert client.get("/api/v1/me/measurements").status_code == 401


def test_new_user_is_not_onboarded_and_gets_the_weekly_email(client, db):
    profile = client.get("/api/v1/me/profile", headers=HEADERS).json()
    assert profile["onboarded_at"] is None
    assert profile["weekly_report_email"] is True


def test_onboarding_saves_the_profile_and_first_measurement(client, db):
    response = onboard(
        client,
        display_name="  Ola ",
        birth_date=years_ago(30),
        sex="female",
        height_cm=168,
        first_measurement={"measured_on": TODAY.isoformat(), "mass_kg": 62.5, "chest_cm": 90},
    )

    assert response.status_code == 200
    profile = response.json()
    assert profile["display_name"] == "Ola"
    assert profile["height_cm"] == 168
    assert profile["onboarded_at"] is not None
    measurements = client.get("/api/v1/me/measurements", headers=HEADERS).json()
    assert [(m["measured_on"], m["mass_kg"], m["chest_cm"], m["hips_cm"]) for m in measurements] == [
        (TODAY.isoformat(), 62.5, 90, None)
    ]


def test_skipping_everything_still_completes_onboarding(client, db):
    assert onboard(client).status_code == 200
    assert client.get("/api/v1/me/profile", headers=HEADERS).json()["onboarded_at"] is not None
    assert client.get("/api/v1/me/measurements", headers=HEADERS).json() == []


def test_the_form_sends_null_for_every_field_it_skipped(client, db):
    body = {"display_name": None, "birth_date": None, "sex": None, "height_cm": None, "first_measurement": None}
    assert onboard(client, **body).status_code == 200


def test_a_measurement_can_skip_some_values(client, db):
    measurement = {"measured_on": TODAY.isoformat(), "mass_kg": 62.5, "chest_cm": None, "hips_cm": None}
    assert onboard(client, display_name=None, first_measurement=measurement).status_code == 200


def test_profile_fields_can_be_cleared(client, db):
    onboard(client, display_name="Ola", birth_date=years_ago(30), height_cm=168)
    body = {"display_name": None, "birth_date": None, "sex": None, "height_cm": None}

    response = client.patch("/api/v1/me/profile", json=body, headers=HEADERS)

    assert response.status_code == 200
    assert response.json()["display_name"] is None
    assert response.json()["height_cm"] is None


def test_a_blank_name_is_no_name(client, db):
    assert onboard(client, display_name="   ").json()["display_name"] is None


def test_onboarding_happens_once(client, db):
    assert onboard(client).status_code == 200
    second = onboard(client, display_name="Ktoś", first_measurement={"measured_on": TODAY.isoformat(), "mass_kg": 80})
    assert second.status_code == 409
    assert client.get("/api/v1/me/profile", headers=HEADERS).json()["display_name"] is None
    assert client.get("/api/v1/me/measurements", headers=HEADERS).json() == []


@pytest.mark.parametrize(
    "body",
    [
        {"height_cm": 99.9},
        {"height_cm": 250.1},
        {"birth_date": years_ago(12)},
        {"birth_date": years_ago(102)},
        {"display_name": "x" * 41},
        {"sex": "other"},
        {"first_measurement": {"measured_on": TODAY.isoformat()}},
        {"first_measurement": {"measured_on": TODAY.isoformat(), "mass_kg": 29}},
        {"first_measurement": {"measured_on": TODAY.isoformat(), "hips_cm": 201}},
        {"first_measurement": {"measured_on": (TODAY - timedelta(days=5)).isoformat(), "mass_kg": 70}},
    ],
)
def test_onboarding_rejects_values_out_of_range(client, db, body):
    assert onboard(client, **body).status_code == 422
    assert client.get("/api/v1/me/profile", headers=HEADERS).json()["onboarded_at"] is None


@pytest.mark.parametrize("height", [100, 250])
def test_height_limits_are_inclusive(client, db, height):
    assert onboard(client, height_cm=height).status_code == 200


def test_age_limits_are_inclusive(client, db):
    assert onboard(client, birth_date=years_ago(13)).status_code == 200
    response = client.patch("/api/v1/me/profile", json={"birth_date": years_ago(100)}, headers=HEADERS)
    assert response.status_code == 200


def test_profile_update_changes_only_the_fields_sent(client, db):
    onboard(client, display_name="Ola", height_cm=168)

    profile = client.patch("/api/v1/me/profile", json={"height_cm": 170, "sex": None}, headers=HEADERS).json()

    assert profile["display_name"] == "Ola"
    assert profile["height_cm"] == 170
    assert profile["sex"] is None


def test_weekly_email_switch_is_saved(client, db):
    response = client.patch("/api/v1/me/profile", json={"weekly_report_email": False}, headers=HEADERS)
    assert response.json()["weekly_report_email"] is False
    assert client.get("/api/v1/me/profile", headers=HEADERS).json()["weekly_report_email"] is False


def test_weekly_email_switch_cannot_be_cleared(client, db):
    response = client.patch("/api/v1/me/profile", json={"weekly_report_email": None}, headers=HEADERS)
    assert response.status_code == 422


def test_profiles_are_per_user(client, db):
    onboard(client, display_name="Ola", first_measurement={"measured_on": TODAY.isoformat(), "mass_kg": 62})
    other = {"Authorization": f"Bearer {make_token(sub='user_jan')}"}

    assert client.get("/api/v1/me/profile", headers=other).json()["display_name"] is None
    assert client.get("/api/v1/me/measurements", headers=other).json() == []
