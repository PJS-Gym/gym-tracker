from datetime import date, timedelta

import pytest

from app.metrics import today_in_warsaw, week_of
from app.training import InvalidRange, resolve_range
from tests.conftest import make_token

HEADERS = {"Authorization": f"Bearer {make_token(sub='user_maciej')}"}
TODAY = today_in_warsaw()
MONDAY, SUNDAY = week_of(TODAY)


def user_id(client, db, headers=HEADERS) -> int:
    return client.get("/api/v1/me", headers=headers).json()["id"]


def exercise(db, owner: int, name: str, primary: list[str], secondary: list[str] = ()) -> int:
    exercise_id = db.execute(
        "INSERT INTO exercises (name, user_id) VALUES (%s, %s) RETURNING id", (name, owner)
    ).fetchone()[0]
    for key, role in [(key, "primary") for key in primary] + [(key, "secondary") for key in secondary]:
        db.execute(
            "INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_key, role) VALUES (%s, %s, %s)",
            (exercise_id, key, role),
        )
    return exercise_id


def workout(db, owner: int, day: date, exercises: list[tuple[int, list[tuple[int, float]]]], finished=True) -> int:
    workout_id = db.execute(
        "INSERT INTO workouts (user_id, workout_date, finished_at) VALUES (%s, %s, %s) RETURNING id",
        (owner, day, "now()" if finished else None),
    ).fetchone()[0]
    if finished:
        db.execute("UPDATE workouts SET finished_at = now() WHERE id = %s", (workout_id,))
    for position, (exercise_id, sets) in enumerate(exercises):
        we = db.execute(
            "INSERT INTO workout_exercises (workout_id, exercise_id, position) VALUES (%s, %s, %s) RETURNING id",
            (workout_id, exercise_id, position),
        ).fetchone()[0]
        for set_position, (reps, kg) in enumerate(sets):
            db.execute(
                "INSERT INTO sets (workout_exercise_id, position, reps, weight_kg) VALUES (%s, %s, %s, %s)",
                (we, set_position, reps, kg),
            )
    return workout_id


def test_training_routes_need_a_token(client):
    for path in ["/api/v1/me/home", "/api/v1/me/summary", "/api/v1/me/workouts/1"]:
        assert client.get(path).status_code == 401


def test_a_new_member_has_no_last_workout_and_an_empty_week(client, db):
    body = client.get("/api/v1/me/home", headers=HEADERS).json()
    assert body["last_workout"] is None
    assert body["week"]["workouts"] == 0
    assert [day["date"] for day in body["week"]["days"]][0] == MONDAY.isoformat()
    assert len(body["week"]["days"]) == 7


def test_home_shows_the_latest_workout_and_this_week(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"], ["triceps"])
    row = exercise(db, me, "Row", ["upper_back"])
    workout(db, me, MONDAY - timedelta(days=3), [(bench, [(10, 50)])])  # last week
    latest = workout(db, me, MONDAY, [(bench, [(8, 60), (8, 60)]), (row, [(10, 40)])])
    workout(db, me, MONDAY, [(row, [(10, 40)])], finished=False)  # a draft never counts

    body = client.get("/api/v1/me/home", headers=HEADERS).json()

    assert body["last_workout"] == {"id": latest, "workout_date": MONDAY.isoformat(), "exercises": 2, "sets": 3}
    # Bench: 2 sets × (1 chest + 0.5 triceps) = 3. Row: 1 upper back = 1.
    assert body["week"]["workouts"] == 1
    assert body["week"]["effective_sets"] == 4
    assert body["week"]["days"][0] == {"date": MONDAY.isoformat(), "trained": True}
    assert not any(day["trained"] for day in body["week"]["days"][1:])


def test_summary_counts_sets_and_tonnage_per_group(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"], ["triceps"])
    squat = exercise(db, me, "Squat", ["quads", "glutes"])
    workout(db, me, MONDAY, [(bench, [(10, 50), (8, 55)]), (squat, [(5, 100)])])

    body = client.get("/api/v1/me/summary?range=this_week", headers=HEADERS).json()

    assert body["workouts"] == 1
    groups = {group["key"]: group for group in body["groups"]}
    assert len(groups) == 17
    assert (groups["chest"]["effective_sets"], groups["chest"]["tonnage_kg"]) == (2, 940)
    assert (groups["triceps"]["effective_sets"], groups["triceps"]["tonnage_kg"]) == (1, 0)
    assert (groups["quads"]["effective_sets"], groups["quads"]["tonnage_kg"]) == (1, 500)
    assert groups["glutes"]["tonnage_kg"] == 500


def test_summary_puts_the_busiest_groups_first_and_empty_ones_last(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"], ["triceps"])
    workout(db, me, MONDAY, [(bench, [(10, 50)] * 3)])

    keys = [group["key"] for group in client.get("/api/v1/me/summary", headers=HEADERS).json()["groups"]]

    assert keys[:2] == ["chest", "triceps"]
    sets = [group["effective_sets"] for group in client.get("/api/v1/me/summary", headers=HEADERS).json()["groups"]]
    assert sets == sorted(sets, reverse=True)


def test_last_week_and_a_custom_range(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"])
    last_monday = MONDAY - timedelta(weeks=1)
    workout(db, me, last_monday, [(bench, [(10, 50)])])

    last_week = client.get("/api/v1/me/summary?range=last_week", headers=HEADERS).json()
    this_week = client.get("/api/v1/me/summary?range=this_week", headers=HEADERS).json()
    custom = client.get(
        f"/api/v1/me/summary?range=custom&from={last_monday}&to={last_monday}", headers=HEADERS
    ).json()

    assert last_week["range"] == {"kind": "last_week", "start": last_monday.isoformat(), "end": (MONDAY - timedelta(days=1)).isoformat()}
    assert last_week["workouts"] == 1
    assert this_week["workouts"] == 0
    assert custom["workouts"] == 1


def test_a_custom_range_cannot_end_before_it_starts(client, db):
    response = client.get(f"/api/v1/me/summary?range=custom&from={MONDAY}&to={MONDAY - timedelta(days=1)}", headers=HEADERS)
    assert response.status_code == 422


def test_resolve_range_rules():
    friday = date(2026, 11, 13)
    assert (resolve_range("last_4_weeks", friday).start, resolve_range("last_4_weeks", friday).end) == (
        date(2026, 10, 19),
        date(2026, 11, 15),
    )
    with pytest.raises(InvalidRange):
        resolve_range("custom", friday)
    with pytest.raises(InvalidRange):
        resolve_range("custom", friday, date(2025, 1, 1), friday)


def test_a_workout_shows_its_exercises_and_sets(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"])
    workout_id = workout(db, me, MONDAY, [(bench, [(10, 50), (8, 52.5)])])

    body = client.get(f"/api/v1/me/workouts/{workout_id}", headers=HEADERS).json()

    assert body["workout_date"] == MONDAY.isoformat()
    assert body["exercises"] == [
        {
            "exercise_id": bench,
            "name": "Bench",
            "sets": [{"reps": 10, "weight_kg": 50, "rpe": None}, {"reps": 8, "weight_kg": 52.5, "rpe": None}],
        }
    ]


def test_another_members_workout_is_not_found(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"])
    workout_id = workout(db, me, MONDAY, [(bench, [(10, 50)])])
    someone_else = {"Authorization": f"Bearer {make_token(sub='user_jan')}"}

    assert client.get(f"/api/v1/me/workouts/{workout_id}", headers=someone_else).status_code == 404
    assert client.get("/api/v1/me/home", headers=someone_else).json()["last_workout"] is None
