"""Import the shared exercises from free-exercise-db.

Run from backend/: uv run python -m app.seed.import_exercises

Safe to run again: existing exercises are updated in place, never duplicated.
"""

import csv
import json
from dataclasses import dataclass
from pathlib import Path
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
SEED_DIR = Path(__file__).parent

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
    name_pl: str | None
    equipment: str | None
    equipment_pl: str | None
    # Muscle group key -> "primary" or "secondary".
    muscles: dict[str, str]


def read_translations(file_name: str, key_column: str) -> dict[str, str]:
    with open(SEED_DIR / file_name, encoding="utf-8", newline="") as file:
        return {row[key_column]: row["name_pl"] for row in csv.DictReader(file)}


def parse_exercise(
    raw: dict[str, Any], names_pl: dict[str, str], equipment_pl: dict[str, str]
) -> Exercise:
    muscles = {MUSCLE_KEYS[name]: "primary" for name in raw["primaryMuscles"]}
    if not muscles:
        raise ValueError(f"Exercise {raw['id']} has no primary muscle group")

    for name in raw["secondaryMuscles"]:
        # setdefault keeps "primary" when a muscle is listed as both.
        muscles.setdefault(MUSCLE_KEYS[name], "secondary")

    equipment = raw["equipment"]
    return Exercise(
        raw["id"],
        raw["name"],
        names_pl.get(raw["id"]),
        equipment,
        equipment_pl.get(equipment),
        muscles,
    )


def load_exercises() -> list[Exercise]:
    with urlopen(DATASET_URL, timeout=120) as response:
        dataset = json.load(response)
    names_pl = read_translations("exercise_names_pl.csv", "source_id")
    equipment_pl = read_translations("equipment_names_pl.csv", "name_en")
    return [
        parse_exercise(raw, names_pl, equipment_pl)
        for raw in dataset
        if raw["category"] in CATEGORIES
    ]


def save_exercises(conn: psycopg.Connection, exercises: list[Exercise]) -> None:
    """Write everything in one transaction, so a failed import changes nothing."""
    with conn.transaction():
        # DO UPDATE leaves deleted_at alone.
        saved = conn.execute(
            """
            INSERT INTO exercises (name, name_pl, equipment, equipment_pl, source, source_id)
            SELECT name, name_pl, equipment, equipment_pl, %(source)s::text, source_id
            FROM unnest(
                %(names)s::text[],
                %(names_pl)s::text[],
                %(equipment)s::text[],
                %(equipment_pl)s::text[],
                %(source_ids)s::text[]
            ) AS t(name, name_pl, equipment, equipment_pl, source_id)
            ON CONFLICT (source, source_id) DO UPDATE SET
                name = EXCLUDED.name,
                name_pl = EXCLUDED.name_pl,
                equipment = EXCLUDED.equipment,
                equipment_pl = EXCLUDED.equipment_pl
            RETURNING source_id, id
            """,
            {
                "source": SOURCE,
                "names": [e.name for e in exercises],
                "names_pl": [e.name_pl for e in exercises],
                "equipment": [e.equipment for e in exercises],
                "equipment_pl": [e.equipment_pl for e in exercises],
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
