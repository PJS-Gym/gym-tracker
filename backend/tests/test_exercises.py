from datetime import timedelta

import pytest

from tests.conftest import make_token
from tests.test_training import HEADERS, MONDAY, TODAY, exercise, user_id, workout

JAN = {"Authorization": f"Bearer {make_token(sub='user_jan')}"}
URL = "/api/v1/me/exercises"


def shared(db, name: str, name_pl: str | None, equipment: str, primary: list[str], secondary=(), category="strength") -> int:
    source_id = f"test_{name}"
    exercise_id = db.execute(
        """
        INSERT INTO exercises (name, name_pl, equipment, category, source, source_id)
        VALUES (%s, %s, %s, %s, 'test', %s) RETURNING id
        """,
        (name, name_pl, equipment, category, source_id),
    ).fetchone()[0]
    for key, role in [(k, "primary") for k in primary] + [(k, "secondary") for k in secondary]:
        db.execute(
            "INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_key, role) VALUES (%s, %s, %s)",
            (exercise_id, key, role),
        )
    return exercise_id


@pytest.fixture
def bench(db):
    # The db fixture has already removed every user and their workouts, so nothing points at these.
    db.execute("DELETE FROM exercises WHERE source = 'test'")
    return shared(db, "Barbell Bench Press", "Wyciskanie sztangi na ławce płaskiej", "barbell", ["chest"], ["triceps"])


def payload(**overrides):
    return {"name": "Pompki na poręczach", "equipment": "body only", "primary": ["chest"], "secondary": ["triceps"], **overrides}


def test_exercise_routes_need_a_token(client):
    assert client.get(URL).status_code == 401
    assert client.post(URL, json=payload()).status_code == 401


def test_the_catalogue_has_shared_and_own_exercises_and_the_filters(client, db, bench):
    me = user_id(client, db)
    exercise(db, me, "Moje wiosło", ["upper_back"])
    exercise(db, user_id(client, db, JAN), "Jana", ["chest"])

    body = client.get(URL, headers=HEADERS).json()

    by_name = {e["name"]: e for e in body["exercises"]}
    assert "Jana" not in by_name
    assert by_name["Moje wiosło"]["own"] is True
    entry = by_name["Wyciskanie sztangi na ławce płaskiej"]
    assert entry["name_en"] == "Barbell Bench Press"
    assert entry["equipment_pl"] == "sztanga"
    assert (entry["own"], entry["primary"], entry["secondary"]) == (False, ["chest"], ["triceps"])
    assert len(body["muscle_groups"]) == 17
    assert {"key": "dumbbell", "name_pl": "hantle"} in body["equipment"]


def test_an_exercise_page_has_its_category(client, db, bench):
    body = client.get(f"{URL}/{bench}", headers=HEADERS).json()
    assert body["category_pl"] == "siłowe"
    assert body["deleted"] is False


def test_adding_an_own_exercise(client, db):
    response = client.post(URL, json=payload(name="  Pompki   na poręczach "), headers=HEADERS)

    assert response.status_code == 201
    body = response.json()
    assert (body["name"], body["own"], body["equipment_pl"]) == ("Pompki na poręczach", True, "masa ciała")
    assert (body["primary"], body["secondary"]) == (["chest"], ["triceps"])


@pytest.mark.parametrize(
    "overrides",
    [
        {"name": "P"},
        {"name": "x" * 81},
        {"primary": []},
        {"primary": ["chest"], "secondary": ["chest"]},
        {"primary": ["not_a_group"]},
        {"equipment": "spaceship"},
    ],
    ids=["name too short", "name too long", "no primary group", "group in both roles", "unknown group", "unknown equipment"],
)
def test_an_invalid_own_exercise_is_refused(client, db, overrides):
    user_id(client, db)
    assert client.post(URL, json=payload(**overrides), headers=HEADERS).status_code == 422


def test_someone_elses_exercise_cannot_be_seen_or_changed(client, db):
    created = client.post(URL, json=payload(), headers=HEADERS).json()["id"]
    user_id(client, db, JAN)

    assert client.get(f"{URL}/{created}", headers=JAN).status_code == 404
    assert client.put(f"{URL}/{created}", json=payload(name="Moje"), headers=JAN).status_code == 404
    assert client.delete(f"{URL}/{created}", headers=JAN).status_code == 404
    assert client.get(f"{URL}/{created}", headers=HEADERS).json()["name"] == "Pompki na poręczach"


def test_a_shared_exercise_cannot_be_changed(client, db, bench):
    user_id(client, db)
    assert client.put(f"{URL}/{bench}", json=payload(), headers=HEADERS).status_code == 403
    assert client.delete(f"{URL}/{bench}", headers=HEADERS).status_code == 403


def test_editing_an_own_exercise(client, db):
    created = client.post(URL, json=payload(), headers=HEADERS).json()["id"]

    body = client.put(f"{URL}/{created}", json=payload(name="Dipy", primary=["triceps"], secondary=[]), headers=HEADERS).json()

    assert (body["name"], body["primary"], body["secondary"]) == ("Dipy", ["triceps"], [])


def test_an_unused_exercise_is_deleted_for_good(client, db):
    created = client.post(URL, json=payload(), headers=HEADERS).json()["id"]

    assert client.delete(f"{URL}/{created}", headers=HEADERS).status_code == 204
    assert db.execute("SELECT count(*) FROM exercises WHERE id = %s", (created,)).fetchone()[0] == 0


def test_a_logged_exercise_is_hidden_but_stays_in_its_workouts(client, db):
    created = client.post(URL, json=payload(), headers=HEADERS).json()["id"]
    me = user_id(client, db)
    logged = workout(db, me, MONDAY, [(created, [(10, 20)])])

    assert client.delete(f"{URL}/{created}", headers=HEADERS).status_code == 204

    names = [e["name"] for e in client.get(URL, headers=HEADERS).json()["exercises"]]
    assert "Pompki na poręczach" not in names
    page = client.get(f"/api/v1/me/workouts/{logged}", headers=HEADERS).json()
    assert page["exercises"][0]["name"] == "Pompki na poręczach"
    assert page["groups"][0]["key"] == "chest"
    detail = client.get(f"{URL}/{created}", headers=HEADERS).json()
    assert detail["deleted"] is True
    assert client.put(f"{URL}/{created}", json=payload(), headers=HEADERS).status_code == 403


def test_changing_muscle_groups_leaves_issued_reports_alone(client, db):
    created = client.post(URL, json=payload(), headers=HEADERS).json()["id"]
    me = user_id(client, db)
    snapshot = '{"muscle_map": [{"key": "chest", "effective_sets": 3}]}'
    db.execute(
        "INSERT INTO reports (user_id, week_start, status, snapshot, issued_at) VALUES (%s, %s, 'ready', %s, now())",
        (me, MONDAY - timedelta(weeks=1), snapshot),
    )

    client.put(f"{URL}/{created}", json=payload(primary=["triceps"], secondary=[]), headers=HEADERS)

    stored = db.execute("SELECT snapshot FROM reports WHERE user_id = %s", (me,)).fetchone()[0]
    assert stored == {"muscle_map": [{"key": "chest", "effective_sets": 3}]}


def test_history_of_an_exercise_never_done(client, db, bench):
    body = client.get(f"{URL}/{bench}/history", headers=HEADERS).json()
    assert body == {"workouts": 0, "recent": [], "best_e1rm": None, "heaviest": None, "points": []}


def test_history_counts_only_sets_that_estimate_strength(client, db, bench):
    me = user_id(client, db)
    first = MONDAY - timedelta(weeks=2)
    # 60 × (1 + 8/30) = 76; 13 reps do not count, the heavier set does: 70 × (1 + 5/30) = 81.67.
    workout(db, me, first, [(bench, [(8, 60), (13, 65)])])
    second = workout(db, me, first + timedelta(days=7), [(bench, [(5, 70), (20, 0)])])
    # Only a set at 0 kg: no e1RM point for this workout, but it is in the history.
    third = workout(db, me, first + timedelta(days=9), [(bench, [(15, 0)])])

    body = client.get(f"{URL}/{bench}/history", headers=HEADERS).json()

    assert body["workouts"] == 3
    assert [w["id"] for w in body["recent"]] == [third, second, body["recent"][2]["id"]]
    assert body["best_e1rm"] == {"value": 81.67, "workout_date": (first + timedelta(days=7)).isoformat()}
    assert body["heaviest"] == {"value": 70, "workout_date": (first + timedelta(days=7)).isoformat()}
    assert [p["e1rm"] for p in body["points"]] == [76, 81.67]
    assert body["recent"][2]["sets"][1]["e1rm"] is None


def test_history_shows_the_last_5_workouts(client, db, bench):
    me = user_id(client, db)
    for days in range(7):
        workout(db, me, TODAY - timedelta(days=days), [(bench, [(5, 50 + days)])])

    body = client.get(f"{URL}/{bench}/history", headers=HEADERS).json()

    assert body["workouts"] == 7
    assert [w["workout_date"] for w in body["recent"]] == [(TODAY - timedelta(days=d)).isoformat() for d in range(5)]
    assert len(body["points"]) == 7


def test_last_time_is_the_best_set_of_the_latest_earlier_workout(client, db, bench):
    me = user_id(client, db)
    old = MONDAY - timedelta(weeks=3)
    workout(db, me, old, [(bench, [(8, 90)])])
    middle = workout(db, me, old + timedelta(days=7), [(bench, [(8, 80), (10, 75), (12, 50)])])
    workout(db, me, old + timedelta(days=14), [(bench, [(5, 85)])])

    def last(before, exclude=None):
        query = {"id": [bench], "before": before.isoformat()}
        if exclude:
            query["exclude"] = exclude
        return client.get(f"{URL}/last", params=query, headers=HEADERS).json()

    # Newest workout: 85 × 5.
    assert [(s["weight_kg"], s["reps"]) for s in last(TODAY)] == [(85, 5)]
    # Editing the middle workout looks at the one before it, not the newest.
    assert [(s["weight_kg"], s["reps"]) for s in last(old + timedelta(days=7), middle)] == [(90, 8)]
    # A workout dated before the middle one: 80 × 8 (101.33) beats 75 × 10 (100) and 50 × 12.
    assert [(s["weight_kg"], s["reps"]) for s in last(old + timedelta(days=13))] == [(80, 8)]


def test_last_time_is_empty_for_an_exercise_done_for_the_first_time(client, db, bench):
    user_id(client, db)
    response = client.get(f"{URL}/last", params={"id": [bench], "before": TODAY.isoformat()}, headers=HEADERS)
    assert response.json() == []
