from datetime import timedelta

import pytest

from tests.conftest import make_token
from tests.test_training import HEADERS, MONDAY, TODAY, exercise, user_id, workout

JAN = {"Authorization": f"Bearer {make_token(sub='user_jan')}"}
URL = "/api/v1/me/workouts"


def a_workout(exercises, day=TODAY, note=None):
    return {"workout_date": day.isoformat(), "note": note, "exercises": exercises}


def test_saving_a_workout_from_the_logger(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"], ["triceps"])
    row = exercise(db, me, "Row", ["upper_back"])
    body = a_workout(
        [
            {"exercise_id": bench, "sets": [{"reps": 8, "weight_kg": 60, "rpe": 8}, {"reps": 8, "weight_kg": 62.25}]},
            {"exercise_id": row, "sets": [{"reps": 10, "weight_kg": 40, "rpe": 7.5}]},
            {"exercise_id": bench, "sets": [{"reps": 12, "weight_kg": 40}]},
            {"exercise_id": row, "sets": []},
        ],
        note="  Dobry dzień  ",
    )

    response = client.post(URL, json=body, headers=HEADERS)

    assert response.status_code == 201
    saved = response.json()
    assert saved["note"] == "Dobry dzień"
    # The same exercise twice is fine; one without sets is dropped.
    assert [e["name"] for e in saved["exercises"]] == ["Bench", "Row", "Bench"]
    assert saved["exercises"][0]["sets"][1] == {"reps": 8, "weight_kg": 62.25, "rpe": None}
    # Bench 3 sets: chest 3, triceps 1.5. Row 1 set: upper back 1.
    assert [(g["key"], g["effective_sets"]) for g in saved["groups"]] == [("chest", 3), ("triceps", 1.5), ("upper_back", 1)]
    # Tonnage: 480 + 498 + 480 to the chest; 400 to the upper back.
    assert saved["groups"][0]["tonnage_kg"] == 1458
    assert saved["tonnage_kg"] == 1858
    assert saved["effective_sets"] == 5.5


def test_several_workouts_on_the_same_day_and_a_late_entry(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"])
    sets = [{"exercise_id": bench, "sets": [{"reps": 5, "weight_kg": 50}]}]
    assert client.post(URL, json=a_workout(sets), headers=HEADERS).status_code == 201
    assert client.post(URL, json=a_workout(sets), headers=HEADERS).status_code == 201
    assert client.post(URL, json=a_workout(sets, day=TODAY - timedelta(days=40)), headers=HEADERS).status_code == 201


@pytest.mark.parametrize(
    ("change", "sets"),
    [
        ({"workout_date": (TODAY + timedelta(days=1)).isoformat()}, [{"reps": 5, "weight_kg": 50}]),
        ({}, []),
        ({}, [{"reps": 0, "weight_kg": 50}]),
        ({}, [{"reps": 101, "weight_kg": 50}]),
        ({}, [{"reps": 5, "weight_kg": 1000.5}]),
        ({}, [{"reps": 5, "weight_kg": 50.1}]),
        ({}, [{"reps": 5, "weight_kg": 50, "rpe": 7.3}]),
        ({}, [{"reps": 5, "weight_kg": 50, "rpe": 10.5}]),
    ],
    ids=["future date", "no sets", "0 reps", "101 reps", "over 1000 kg", "kg off the 0.25 step", "RPE off the 0.5 step", "RPE over 10"],
)
def test_an_invalid_workout_is_refused(client, db, change, sets):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"])
    body = {**a_workout([{"exercise_id": bench, "sets": sets}]), **change}
    assert client.post(URL, json=body, headers=HEADERS).status_code == 422
    assert client.get(URL, headers=HEADERS).json()["items"] == []


def test_someone_elses_exercise_cannot_be_logged(client, db):
    jans = exercise(db, user_id(client, db, JAN), "Jana", ["chest"])
    user_id(client, db)
    body = a_workout([{"exercise_id": jans, "sets": [{"reps": 5, "weight_kg": 50}]}])
    assert client.post(URL, json=body, headers=HEADERS).status_code == 422


def test_the_history_is_newest_first_in_pages_of_20(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"], ["triceps"])
    row = exercise(db, me, "Row", ["upper_back"])
    ids = [workout(db, me, TODAY - timedelta(days=day), [(bench, [(5, 50), (5, 50)]), (row, [(10, 40)])]) for day in range(45)]

    first = client.get(URL, headers=HEADERS).json()
    second = client.get(URL, params={"after": first["next"]}, headers=HEADERS).json()
    third = client.get(URL, params={"after": second["next"]}, headers=HEADERS).json()

    listed = [item["id"] for page in (first, second, third) for item in page["items"]]
    assert listed == ids
    assert (len(first["items"]), len(third["items"]), third["next"]) == (20, 5, None)
    item = first["items"][0]
    assert item == {
        "id": ids[0],
        "workout_date": TODAY.isoformat(),
        "exercises": ["Bench", "Row"],
        "sets": 3,
        "primary_groups": ["klatka piersiowa", "górna część pleców"],
    }


def test_editing_a_workout_keeps_its_report(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"])
    row = exercise(db, me, "Row", ["upper_back"])
    last_week = MONDAY - timedelta(days=3)
    workout_id = workout(db, me, last_week, [(bench, [(5, 50)])])
    db.execute(
        "INSERT INTO reports (user_id, week_start, status, snapshot, issued_at) VALUES (%s, %s, 'ready', %s, now())",
        (me, MONDAY - timedelta(weeks=1), '{"workouts": 1}'),
    )
    body = a_workout([{"exercise_id": row, "sets": [{"reps": 10, "weight_kg": 40}]}], day=last_week - timedelta(days=1), note="Zmiana")

    edited = client.put(f"{URL}/{workout_id}", json=body, headers=HEADERS).json()

    assert (edited["workout_date"], edited["note"]) == ((last_week - timedelta(days=1)).isoformat(), "Zmiana")
    assert [e["name"] for e in edited["exercises"]] == ["Row"]
    assert db.execute("SELECT snapshot FROM reports WHERE user_id = %s", (me,)).fetchone()[0] == {"workouts": 1}


def test_deleting_a_workout_keeps_its_report(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"])
    workout_id = workout(db, me, MONDAY - timedelta(days=3), [(bench, [(5, 50)])])
    db.execute(
        "INSERT INTO reports (user_id, week_start, status, snapshot, issued_at) VALUES (%s, %s, 'ready', %s, now())",
        (me, MONDAY - timedelta(weeks=1), '{"workouts": 1}'),
    )

    assert client.delete(f"{URL}/{workout_id}", headers=HEADERS).status_code == 204

    assert client.get(f"{URL}/{workout_id}", headers=HEADERS).status_code == 404
    assert client.get(URL, headers=HEADERS).json()["items"] == []
    assert db.execute("SELECT snapshot FROM reports WHERE user_id = %s", (me,)).fetchone()[0] == {"workouts": 1}


def test_someone_elses_workout_cannot_be_changed_or_deleted(client, db):
    me = user_id(client, db)
    bench = exercise(db, me, "Bench", ["chest"])
    workout_id = workout(db, me, MONDAY, [(bench, [(5, 50)])])
    user_id(client, db, JAN)
    body = a_workout([{"exercise_id": bench, "sets": [{"reps": 5, "weight_kg": 50}]}])

    assert client.put(f"{URL}/{workout_id}", json=body, headers=JAN).status_code == 404
    assert client.delete(f"{URL}/{workout_id}", headers=JAN).status_code == 404
    assert client.get(f"{URL}/{workout_id}", headers=HEADERS).status_code == 200


def test_a_deleted_own_exercise_stays_editable_in_its_workout(client, db):
    me = user_id(client, db)
    dips = exercise(db, me, "Dipy", ["chest"])
    workout_id = workout(db, me, MONDAY, [(dips, [(10, 0)])])
    db.execute("UPDATE exercises SET deleted_at = now() WHERE id = %s", (dips,))
    body = a_workout([{"exercise_id": dips, "sets": [{"reps": 12, "weight_kg": 0}]}], day=MONDAY)

    assert client.put(f"{URL}/{workout_id}", json=body, headers=HEADERS).status_code == 200
    # It is no longer offered for new workouts.
    assert client.post(URL, json=body, headers=HEADERS).status_code == 422


def test_a_member_without_workouts_gets_an_empty_page(client, db):
    assert client.get(URL, headers=HEADERS).json() == {"items": [], "next": None}
