"""Import the shared exercises from free-exercise-db.

Run from backend/: uv run python -m app.seed.import_exercises

Safe to run again: existing exercises are updated in place, never duplicated.
"""

import json
from dataclasses import dataclass
from typing import Any
from urllib.request import urlopen

import psycopg

from app.core.db import get_pool

SOURCE = "free-exercise-db"
# Pinned to a commit so every import reads the same data.
DATASET_URL = (
    "https://raw.githubusercontent.com/yuhonas/free-exercise-db/"
    "f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/dist/exercises.json"
)
CATEGORIES = {"strength", "powerlifting", "olympic weightlifting", "strongman"}

# Every muscle name used in the dataset, mapped to one of our 17 muscle groups.
# A name missing from this table stops the import instead of being dropped quietly.
MUSCLE_KEYS = {
    "abdominals": "abs",
    "abductors": "abductors",
    "adductors": "adductors",
    "biceps": "biceps",
    "calves": "calves",
    "chest": "chest",
    "forearms": "forearms",
    "glutes": "glutes",
    "hamstrings": "hamstrings",
    "lats": "lats",
    "lower back": "lower_back",
    "middle back": "upper_back",
    "neck": "neck",
    "quadriceps": "quads",
    "shoulders": "shoulders",
    "traps": "traps",
    "triceps": "triceps",
}


@dataclass(frozen=True)
class Exercise:
    source_id: str
    name: str
    equipment: str | None
    # Muscle group key -> "primary" or "secondary".
    muscles: dict[str, str]


def parse_exercise(raw: dict[str, Any]) -> Exercise:
    muscles = {MUSCLE_KEYS[name]: "primary" for name in raw["primaryMuscles"]}
    if not muscles:
        raise ValueError(f"Exercise {raw['id']} has no primary muscle group")

    for name in raw["secondaryMuscles"]:
        # setdefault keeps "primary" when a muscle is listed as both.
        muscles.setdefault(MUSCLE_KEYS[name], "secondary")

    return Exercise(raw["id"], raw["name"], raw["equipment"], muscles)


def load_exercises() -> list[Exercise]:
    with urlopen(DATASET_URL, timeout=120) as response:
        dataset = json.load(response)
    return [parse_exercise(raw) for raw in dataset if raw["category"] in CATEGORIES]


def save_exercises(conn: psycopg.Connection, exercises: list[Exercise]) -> None:
    """Write everything in one transaction, so a failed import changes nothing."""
    with conn.transaction():
        # DO UPDATE leaves name_pl and deleted_at alone.
        saved = conn.execute(
            """
            INSERT INTO exercises (name, equipment, source, source_id)
            SELECT name, equipment, %(source)s::text, source_id
            FROM unnest(%(names)s::text[], %(equipment)s::text[], %(source_ids)s::text[])
                AS t(name, equipment, source_id)
            ON CONFLICT (source, source_id) DO UPDATE
                SET name = EXCLUDED.name, equipment = EXCLUDED.equipment
            RETURNING source_id, id
            """,
            {
                "source": SOURCE,
                "names": [e.name for e in exercises],
                "equipment": [e.equipment for e in exercises],
                "source_ids": [e.source_id for e in exercises],
            },
        ).fetchall()
        ids = dict(saved)

        links = [
            (ids[e.source_id], key, role)
            for e in exercises
            for key, role in e.muscles.items()
        ]
        conn.execute(
            "DELETE FROM exercise_muscle_groups WHERE exercise_id = ANY(%s)",
            (list(ids.values()),),
        )
        conn.execute(
            """
            INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_key, role)
            SELECT * FROM unnest(%s::bigint[], %s::text[], %s::text[])
            """,
            (
                [link[0] for link in links],
                [link[1] for link in links],
                [link[2] for link in links],
            ),
        )


def main() -> None:
    exercises = load_exercises()
    pool = get_pool()
    try:
        with pool.connection() as conn:
            save_exercises(conn, exercises)
    finally:
        pool.close()
    print(f"Imported {len(exercises)} exercises from {SOURCE}.")


if __name__ == "__main__":
    main()
