"""The exercise catalogue (#9), a user's own exercises (#10) and their history on an exercise (#15).

Shared exercises have no owner and cannot be changed. A user's own exercise is visible only to
them; deleting one that was already logged only hides it, so past workouts and statistics keep it.
"""

import csv
from datetime import date
from pathlib import Path
from typing import Annotated

from psycopg import Connection
from pydantic import AfterValidator, BaseModel, Field, model_validator

from app.metrics import e1rm

SEED_DIR = Path(__file__).parent / "seed"

CATEGORY_PL = {
    "strength": "siłowe",
    "powerlifting": "trójbój siłowy",
    "olympic weightlifting": "podnoszenie ciężarów",
    "strongman": "strongman",
}


def _equipment_names() -> dict[str, str]:
    with open(SEED_DIR / "equipment_names_pl.csv", encoding="utf-8", newline="") as file:
        return {row["name_en"]: row["name_pl"] for row in csv.DictReader(file)}


# English key (as in the dataset) -> Polish name. Own exercises pick from the same list.
EQUIPMENT_PL = _equipment_names()

NAME_MIN, NAME_MAX = 2, 80
RECENT_WORKOUTS = 5


class Option(BaseModel):
    key: str
    name_pl: str


class Exercise(BaseModel):
    id: int
    # Polish name when there is one, otherwise the dataset's English name.
    name: str
    name_en: str
    equipment: str | None
    equipment_pl: str | None
    own: bool
    primary: list[str]
    secondary: list[str]


class Catalogue(BaseModel):
    """Everything the list and the picker need in one response: a few hundred rows, filtered on the phone."""

    exercises: list[Exercise]
    muscle_groups: list[Option]
    equipment: list[Option]


class ExerciseDetail(Exercise):
    category_pl: str | None
    # A deleted own exercise still opens from an old workout, read-only.
    deleted: bool


def _clean_name(value: str) -> str:
    value = " ".join(value.split())
    if not NAME_MIN <= len(value) <= NAME_MAX:
        raise ValueError(f"name must have {NAME_MIN} to {NAME_MAX} characters")
    return value


def _check_equipment(value: str | None) -> str | None:
    if value is not None and value not in EQUIPMENT_PL:
        raise ValueError("unknown equipment")
    return value


class ExerciseIn(BaseModel):
    name: Annotated[str, AfterValidator(_clean_name)]
    equipment: Annotated[str | None, AfterValidator(_check_equipment)] = None
    primary: Annotated[list[str], Field(min_length=1, max_length=17)]
    secondary: Annotated[list[str], Field(max_length=17)] = []

    @model_validator(mode="after")
    def _one_role_per_group(self):
        if set(self.primary) & set(self.secondary):
            raise ValueError("a muscle group cannot be both primary and secondary")
        if len(set(self.primary)) != len(self.primary) or len(set(self.secondary)) != len(self.secondary):
            raise ValueError("a muscle group is listed twice")
        return self


class UnknownMuscleGroup(ValueError):
    pass


_SELECT = """
    SELECT e.id, COALESCE(NULLIF(e.name_pl, ''), e.name), e.name, e.equipment, e.equipment_pl,
           e.user_id IS NOT NULL,
           COALESCE(array_agg(m.muscle_group_key ORDER BY m.muscle_group_key) FILTER (WHERE m.role = 'primary'), '{}'),
           COALESCE(array_agg(m.muscle_group_key ORDER BY m.muscle_group_key) FILTER (WHERE m.role = 'secondary'), '{}'),
           e.category, e.deleted_at IS NOT NULL
    FROM exercises e
    LEFT JOIN exercise_muscle_groups m ON m.exercise_id = e.id
"""


def _exercise(row: tuple) -> Exercise:
    equipment = row[3]
    return Exercise(
        id=row[0],
        name=row[1],
        name_en=row[2],
        equipment=equipment,
        equipment_pl=(row[4] or EQUIPMENT_PL.get(equipment)) if equipment else None,
        own=row[5],
        primary=list(row[6]),
        secondary=list(row[7]),
    )


def catalogue(conn: Connection, user_id: int) -> Catalogue:
    rows = conn.execute(
        _SELECT
        + """
        WHERE (e.user_id IS NULL OR e.user_id = %s) AND e.deleted_at IS NULL
        GROUP BY e.id
        ORDER BY 2
        """,
        (user_id,),
    ).fetchall()
    groups = conn.execute("SELECT key, name_pl FROM muscle_groups ORDER BY name_pl").fetchall()
    return Catalogue(
        exercises=[_exercise(row) for row in rows],
        muscle_groups=[Option(key=key, name_pl=name) for key, name in groups],
        equipment=sorted((Option(key=key, name_pl=name) for key, name in EQUIPMENT_PL.items()), key=lambda o: o.name_pl),
    )


def get_exercise(conn: Connection, user_id: int, exercise_id: int) -> ExerciseDetail | None:
    """A shared exercise or one of the user's own. Someone else's is the same as a missing one."""
    row = conn.execute(
        _SELECT + "WHERE e.id = %s AND (e.user_id IS NULL OR e.user_id = %s) GROUP BY e.id",
        (exercise_id, user_id),
    ).fetchone()
    if row is None:
        return None
    return ExerciseDetail(
        **_exercise(row).model_dump(),
        category_pl=CATEGORY_PL.get(row[8]) if row[8] else None,
        deleted=row[9],
    )


def _save_groups(conn: Connection, exercise_id: int, data: ExerciseIn) -> None:
    known = {key for (key,) in conn.execute("SELECT key FROM muscle_groups").fetchall()}
    if not set(data.primary + data.secondary) <= known:
        raise UnknownMuscleGroup("unknown muscle group")
    conn.execute("DELETE FROM exercise_muscle_groups WHERE exercise_id = %s", (exercise_id,))
    with conn.cursor() as cur:
        cur.executemany(
            "INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_key, role) VALUES (%s, %s, %s)",
            [(exercise_id, key, "primary") for key in data.primary]
            + [(exercise_id, key, "secondary") for key in data.secondary],
        )


def create_exercise(conn: Connection, user_id: int, data: ExerciseIn) -> int:
    with conn.transaction():
        exercise_id = conn.execute(
            "INSERT INTO exercises (name, equipment, equipment_pl, user_id) VALUES (%s, %s, %s, %s) RETURNING id",
            (data.name, data.equipment, EQUIPMENT_PL.get(data.equipment or ""), user_id),
        ).fetchone()[0]
        _save_groups(conn, exercise_id, data)
    return exercise_id


def update_exercise(conn: Connection, user_id: int, exercise_id: int, data: ExerciseIn) -> bool:
    """Changes one of the user's own exercises. False for a shared, deleted or someone else's exercise.

    Reports keep their own snapshot, so new muscle groups never change a report already issued.
    """
    with conn.transaction():
        updated = conn.execute(
            """
            UPDATE exercises SET name = %s, equipment = %s, equipment_pl = %s
            WHERE id = %s AND user_id = %s AND deleted_at IS NULL
            RETURNING id
            """,
            (data.name, data.equipment, EQUIPMENT_PL.get(data.equipment or ""), exercise_id, user_id),
        ).fetchone()
        if updated is None:
            return False
        _save_groups(conn, exercise_id, data)
    return True


def delete_exercise(conn: Connection, user_id: int, exercise_id: int) -> bool:
    """Removes one of the user's own exercises: for good when it was never logged, otherwise only hidden."""
    with conn.transaction():
        used = conn.execute(
            "SELECT EXISTS (SELECT 1 FROM workout_exercises WHERE exercise_id = %s)", (exercise_id,)
        ).fetchone()[0]
        if used:
            row = conn.execute(
                "UPDATE exercises SET deleted_at = now() WHERE id = %s AND user_id = %s AND deleted_at IS NULL RETURNING id",
                (exercise_id, user_id),
            ).fetchone()
        else:
            row = conn.execute(
                "DELETE FROM exercises WHERE id = %s AND user_id = %s AND deleted_at IS NULL RETURNING id",
                (exercise_id, user_id),
            ).fetchone()
    return row is not None


# History on one exercise (#15)


class HistorySet(BaseModel):
    reps: int
    weight_kg: float
    rpe: float | None
    e1rm: float | None


class HistoryWorkout(BaseModel):
    id: int
    workout_date: date
    sets: list[HistorySet]
    best_e1rm: float | None


class Record(BaseModel):
    value: float
    workout_date: date


class Point(BaseModel):
    workout_date: date
    e1rm: float


class History(BaseModel):
    workouts: int
    # Latest first.
    recent: list[HistoryWorkout]
    best_e1rm: Record | None
    heaviest: Record | None
    # The best e1RM of each workout that has a set that counts, oldest first.
    points: list[Point]


def history(conn: Connection, user_id: int, exercise_id: int) -> History:
    rows = conn.execute(
        """
        SELECT w.id, w.workout_date, s.reps, s.weight_kg, s.rpe
        FROM workouts w
        JOIN workout_exercises we ON we.workout_id = w.id
        JOIN sets s ON s.workout_exercise_id = we.id
        WHERE w.user_id = %s AND we.exercise_id = %s AND w.finished_at IS NOT NULL
        ORDER BY w.workout_date DESC, w.id DESC, we.position, s.position
        """,
        (user_id, exercise_id),
    ).fetchall()

    workouts: dict[int, HistoryWorkout] = {}
    for workout_id, day, reps, weight, rpe in rows:
        weight, rpe = float(weight), float(rpe) if rpe is not None else None
        workout = workouts.setdefault(workout_id, HistoryWorkout(id=workout_id, workout_date=day, sets=[], best_e1rm=None))
        estimate = e1rm(reps, weight, rpe)
        workout.sets.append(HistorySet(reps=reps, weight_kg=weight, rpe=rpe, e1rm=round(estimate, 2) if estimate else None))
        if estimate is not None and (workout.best_e1rm is None or estimate > workout.best_e1rm):
            workout.best_e1rm = estimate

    ordered = list(workouts.values())
    for workout in ordered:
        workout.best_e1rm = round(workout.best_e1rm, 2) if workout.best_e1rm is not None else None

    best = max((w for w in ordered if w.best_e1rm is not None), key=lambda w: w.best_e1rm, default=None)
    heaviest = None
    for workout in reversed(ordered):  # oldest first, so a tie keeps the date it was first lifted
        top = max((s.weight_kg for s in workout.sets), default=0)
        if top > 0 and (heaviest is None or top > heaviest.value):
            heaviest = Record(value=top, workout_date=workout.workout_date)

    return History(
        workouts=len(ordered),
        recent=ordered[:RECENT_WORKOUTS],
        best_e1rm=Record(value=best.best_e1rm, workout_date=best.workout_date) if best else None,
        heaviest=heaviest,
        points=[Point(workout_date=w.workout_date, e1rm=w.best_e1rm) for w in reversed(ordered) if w.best_e1rm is not None],
    )


# "Ostatnio" in the logger (#13)


class LastSet(BaseModel):
    exercise_id: int
    workout_date: date
    reps: int
    weight_kg: float


def last_sets(
    conn: Connection, user_id: int, exercise_ids: list[int], before: date, exclude_workout: int | None = None
) -> list[LastSet]:
    """For each exercise, the set with the highest e1RM from the latest earlier workout that had it.

    "Earlier" is judged against the workout being written: dated before it, or the same day and
    saved before it. When no set of that workout counts for e1RM, the heaviest one is shown.
    """
    if not exercise_ids:
        return []
    rows = conn.execute(
        """
        WITH latest AS (
            SELECT DISTINCT ON (we.exercise_id) we.exercise_id, w.id AS workout_id, w.workout_date
            FROM workouts w
            JOIN workout_exercises we ON we.workout_id = w.id
            WHERE w.user_id = %(user)s AND w.finished_at IS NOT NULL AND we.exercise_id = ANY(%(ids)s)
              AND (w.workout_date < %(before)s
                   OR (w.workout_date = %(before)s AND (%(exclude)s::bigint IS NULL OR w.id < %(exclude)s)))
              AND w.id IS DISTINCT FROM %(exclude)s
            ORDER BY we.exercise_id, w.workout_date DESC, w.id DESC
        )
        SELECT l.exercise_id, l.workout_date, s.reps, s.weight_kg, s.rpe
        FROM latest l
        JOIN workout_exercises we ON we.workout_id = l.workout_id AND we.exercise_id = l.exercise_id
        JOIN sets s ON s.workout_exercise_id = we.id
        """,
        {"user": user_id, "ids": exercise_ids, "before": before, "exclude": exclude_workout},
    ).fetchall()

    best: dict[int, tuple[tuple, LastSet]] = {}
    for exercise_id, day, reps, weight, rpe in rows:
        weight = float(weight)
        estimate = e1rm(reps, weight, float(rpe) if rpe is not None else None)
        rank = (estimate is not None, estimate or 0, weight, reps)
        if exercise_id not in best or rank > best[exercise_id][0]:
            best[exercise_id] = (rank, LastSet(exercise_id=exercise_id, workout_date=day, reps=reps, weight_kg=weight))
    return [entry for _, entry in best.values()]
