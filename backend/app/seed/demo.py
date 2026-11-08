"""Create the demo account with 8 weeks of data.

Run from backend/, after the exercise import: uv run python -m app.seed.demo

Running it again deletes the demo account and rebuilds it from scratch. The
data is always the same, only its dates move so that it ends last week.
"""

import json
from dataclasses import dataclass
from datetime import UTC, date, datetime, time, timedelta
from pathlib import Path

import psycopg
from psycopg.types.json import Jsonb

from app.core.db import get_pool
from app.seed.import_exercises import SOURCE

CLERK_ID = "demo"
CUSTOM_EXERCISE_NAME = "Pompki na poręczach z plecakiem"
CUSTOM_EXERCISE_MUSCLES = {"chest": "primary", "triceps": "secondary"}
WEEKS = 8
REPORTS_DIR = Path(__file__).parent / "demo_reports"


@dataclass(frozen=True)
class PlannedExercise:
    source_id: str | None  # None is the demo account's own exercise.
    start_kg: float
    step_kg: float  # Added every week that has workouts.
    sets: int
    reps: int
    rpe: float | None


@dataclass(frozen=True)
class LoggedSet:
    reps: int
    weight_kg: float
    rpe: float | None


@dataclass(frozen=True)
class LoggedExercise:
    source_id: str | None
    sets: list[LoggedSet]


@dataclass(frozen=True)
class Workout:
    week: int
    day: int  # 0 is Monday.
    exercises: list[LoggedExercise]


PUSH = [
    PlannedExercise("Barbell_Bench_Press_-_Medium_Grip", 60, 2.5, 4, 8, 8),
    PlannedExercise("Standing_Military_Press", 35, 1.25, 3, 8, None),
    PlannedExercise(None, 10, 1.25, 3, 10, 8),
    PlannedExercise("Side_Lateral_Raise", 10, 0, 3, 15, None),
    PlannedExercise("Triceps_Pushdown", 25, 1.25, 3, 12, 7),
]
PULL = [
    PlannedExercise("Barbell_Deadlift", 100, 5, 3, 5, 8.5),
    PlannedExercise("Pullups", 0, 0, 3, 8, None),
    PlannedExercise("Bent_Over_Barbell_Row", 50, 2.5, 4, 10, None),
    PlannedExercise("Dumbbell_Bicep_Curl", 12, 0.5, 3, 12, 6.5),
]
LEGS = [
    PlannedExercise("Barbell_Squat", 80, 5, 4, 6, 8),
    PlannedExercise("Leg_Press", 120, 10, 3, 12, None),
    PlannedExercise("Lying_Leg_Curls", 35, 2.5, 3, 12, 8),
    PlannedExercise("Standing_Calf_Raises", 40, 5, 3, 15, None),
]
UPPER = [
    PlannedExercise("Dumbbell_Bench_Press", 24, 1, 3, 10, 8),
    PlannedExercise("Wide-Grip_Lat_Pulldown", 45, 2.5, 3, 10, None),
    PlannedExercise(None, 12.5, 1.25, 3, 8, 8.5),
    PlannedExercise("Cable_Crunch", 30, 2.5, 3, 15, None),
]
THREE_DAYS = [(0, PUSH), (2, PULL), (4, LEGS)]
FOUR_DAYS = [(0, PUSH), (1, PULL), (3, LEGS), (5, UPPER)]
# One schedule per week. The fifth week has no workouts.
SCHEDULE = [THREE_DAYS, FOUR_DAYS, THREE_DAYS, FOUR_DAYS, [], THREE_DAYS, FOUR_DAYS, THREE_DAYS]

# (week, day, mass_kg, chest_cm, hips_cm). Week 7 (index 6) has no measurement,
# which is why its report has no body section.
MEASUREMENTS = [
    (0, 0, 82.0, 104.0, 99.0),
    (2, 0, 81.6, None, None),
    (3, 6, 81.4, 104.5, 98.5),
    (5, 0, 81.5, 104.5, 98.5),
    (7, 2, 80.8, 105.0, 98.0),
]

# (week, file, opened)
REPORTS = [
    (6, "without_body.json", True),
    (7, "with_body.json", False),
]


def build_workouts() -> list[Workout]:
    workouts = []
    trained_weeks = 0
    for week, days in enumerate(SCHEDULE):
        for day, plan in days:
            exercises = [log_exercise(planned, trained_weeks) for planned in plan]
            workouts.append(Workout(week, day, exercises))
        if days:
            trained_weeks += 1
    return workouts


def log_exercise(planned: PlannedExercise, trained_weeks: int) -> LoggedExercise:
    weight_kg = planned.start_kg + planned.step_kg * trained_weeks
    sets = []
    for number in range(planned.sets):
        is_last = number == planned.sets - 1
        rpe = planned.rpe + 0.5 if planned.rpe is not None and is_last else planned.rpe
        sets.append(LoggedSet(planned.reps, weight_kg, rpe))
    return LoggedExercise(planned.source_id, sets)


def first_monday(today: date) -> date:
    """Return the Monday that starts the first of the 8 weeks ending last Sunday."""
    this_monday = today - timedelta(days=today.weekday())
    return this_monday - timedelta(weeks=WEEKS)


def insert_returning_ids(cur: psycopg.Cursor, sql: str, rows: list[tuple]) -> list[int]:
    cur.executemany(sql, rows, returning=True)
    ids = []
    while True:
        ids.append(cur.fetchone()[0])
        if not cur.nextset():
            return ids


def load_exercise_ids(conn: psycopg.Connection, workouts: list[Workout]) -> dict[str, int]:
    wanted = {e.source_id for w in workouts for e in w.exercises if e.source_id is not None}
    rows = conn.execute(
        "SELECT source_id, id FROM exercises WHERE source = %s AND source_id = ANY(%s)",
        (SOURCE, list(wanted)),
    ).fetchall()
    ids = dict(rows)
    if missing := wanted - ids.keys():
        raise RuntimeError(
            f"{len(missing)} exercises are missing. "
            "Run `uv run python -m app.seed.import_exercises` first."
        )
    return ids


def create_demo_account(conn: psycopg.Connection, today: date) -> None:
    """Rebuild the account in one transaction, so a failure leaves the old one intact."""
    start = first_monday(today)
    workouts = build_workouts()

    with conn.transaction(), conn.cursor() as cur:
        # Everything else belonging to the account goes with it (ON DELETE CASCADE).
        conn.execute("DELETE FROM users WHERE clerk_id = %s", (CLERK_ID,))

        exercise_ids: dict[str | None, int] = dict(load_exercise_ids(conn, workouts))

        user_id = conn.execute(
            """
            INSERT INTO users
                (clerk_id, created_at, display_name, birth_date, sex, height_cm,
                 onboarded_at, weekly_report_email)
            VALUES (%s, %s, 'Demo', '1998-05-14', 'undisclosed', 180, %s, false)
            RETURNING id
            """,
            (CLERK_ID, start, start),
        ).fetchone()[0]

        custom_id = conn.execute(
            "INSERT INTO exercises (name, user_id) VALUES (%s, %s) RETURNING id",
            (CUSTOM_EXERCISE_NAME, user_id),
        ).fetchone()[0]
        exercise_ids[None] = custom_id
        cur.executemany(
            """
            INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_key, role)
            VALUES (%s, %s, %s)
            """,
            [(custom_id, key, role) for key, role in CUSTOM_EXERCISE_MUSCLES.items()],
        )

        def day_of(week: int, day: int) -> date:
            return start + timedelta(weeks=week, days=day)

        workout_ids = insert_returning_ids(
            cur,
            """
            INSERT INTO workouts (user_id, workout_date, finished_at)
            VALUES (%s, %s, %s) RETURNING id
            """,
            [
                (
                    user_id,
                    day_of(w.week, w.day),
                    datetime.combine(day_of(w.week, w.day), time(18), UTC),
                )
                for w in workouts
            ],
        )

        logged = [
            (workout_id, position, exercise)
            for workout_id, workout in zip(workout_ids, workouts, strict=True)
            for position, exercise in enumerate(workout.exercises)
        ]
        workout_exercise_ids = insert_returning_ids(
            cur,
            """
            INSERT INTO workout_exercises (workout_id, exercise_id, position)
            VALUES (%s, %s, %s) RETURNING id
            """,
            [
                (workout_id, exercise_ids[exercise.source_id], position)
                for workout_id, position, exercise in logged
            ],
        )

        cur.executemany(
            """
            INSERT INTO sets (workout_exercise_id, position, reps, weight_kg, rpe)
            VALUES (%s, %s, %s, %s, %s)
            """,
            [
                (workout_exercise_id, position, s.reps, s.weight_kg, s.rpe)
                for workout_exercise_id, (_, _, exercise) in zip(
                    workout_exercise_ids, logged, strict=True
                )
                for position, s in enumerate(exercise.sets)
            ],
        )

        cur.executemany(
            """
            INSERT INTO body_measurements (user_id, measured_on, mass_kg, chest_cm, hips_cm)
            VALUES (%s, %s, %s, %s, %s)
            """,
            [
                (user_id, day_of(week, day), mass, chest, hips)
                for week, day, mass, chest, hips in MEASUREMENTS
            ],
        )

        for week, file_name, opened in REPORTS:
            week_start = day_of(week, 0)
            snapshot = json.loads((REPORTS_DIR / file_name).read_text(encoding="utf-8"))
            snapshot["meta"]["week_start"] = week_start.isoformat()
            snapshot["meta"]["week_end"] = (week_start + timedelta(days=6)).isoformat()
            issued_at = datetime.combine(week_start + timedelta(weeks=1), time(6), UTC)
            conn.execute(
                """
                INSERT INTO reports (user_id, week_start, status, snapshot, issued_at, opened_at)
                VALUES (%s, %s, 'ready', %s, %s, %s)
                """,
                (
                    user_id,
                    week_start,
                    Jsonb(snapshot),
                    issued_at,
                    issued_at + timedelta(hours=3) if opened else None,
                ),
            )


def main() -> None:
    pool = get_pool()
    try:
        with pool.connection() as conn:
            create_demo_account(conn, date.today())
    finally:
        pool.close()
    print(f"Demo account '{CLERK_ID}' is ready.")


if __name__ == "__main__":
    main()
