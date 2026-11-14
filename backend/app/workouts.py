"""Writing and reading a user's workouts: the logger (#11), history and workout page (#12), edit (#13).

The logger keeps an unfinished workout on the phone and sends it here whole when it is finished,
so a workout in the database is always finished. Reports keep their own snapshot, so editing or
deleting a workout never changes a report already issued.
"""

from datetime import UTC, date, datetime
from decimal import Decimal
from typing import Annotated

from psycopg import Connection
from pydantic import AfterValidator, BaseModel, Field

from app.metrics import SetRecord, effective_sets_by_group, tonnage_by_group
from app.training import FINISHED, MuscleGroupTotal

PAGE_SIZE = 20
NOTE_MAX = 2000


def _step(step: str):
    def check(value: float | None) -> float | None:
        if value is not None and Decimal(str(value)) % Decimal(step) != 0:
            raise ValueError(f"must be a multiple of {step}")
        return value

    return AfterValidator(check)


def _clean_note(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    if len(value) > NOTE_MAX:
        raise ValueError(f"note must be at most {NOTE_MAX} characters")
    return value or None


class SetIn(BaseModel):
    reps: Annotated[int, Field(ge=1, le=100)]
    weight_kg: Annotated[float, Field(ge=0, le=1000), _step("0.25")]
    rpe: Annotated[float | None, Field(ge=1, le=10), _step("0.5")] = None


class ExerciseIn(BaseModel):
    exercise_id: int
    sets: Annotated[list[SetIn], Field(max_length=50)]


class WorkoutIn(BaseModel):
    workout_date: date
    note: Annotated[str | None, AfterValidator(_clean_note)] = None
    # The same exercise may appear twice. Exercises without sets are dropped.
    exercises: Annotated[list[ExerciseIn], Field(max_length=50)]


class InvalidWorkout(ValueError):
    pass


def _check(conn: Connection, user_id: int, data: WorkoutIn, today: date, workout_id: int | None = None) -> list[ExerciseIn]:
    if data.workout_date > today:
        raise InvalidWorkout("A workout cannot be dated in the future")
    exercises = [exercise for exercise in data.exercises if exercise.sets]
    if not exercises:
        raise InvalidWorkout("A workout needs at least one set")
    ids = list({exercise.exercise_id for exercise in exercises})
    # Shared or own and not deleted; a deleted own exercise only when the workout already has it.
    allowed = {
        exercise_id
        for (exercise_id,) in conn.execute(
            """
            SELECT e.id FROM exercises e
            WHERE e.id = ANY(%(ids)s) AND (e.user_id IS NULL OR e.user_id = %(user)s)
              AND (e.deleted_at IS NULL OR EXISTS (
                  SELECT 1 FROM workout_exercises we WHERE we.exercise_id = e.id AND we.workout_id = %(workout)s))
            """,
            {"ids": ids, "user": user_id, "workout": workout_id},
        ).fetchall()
    }
    if set(ids) - allowed:
        raise InvalidWorkout("Unknown exercise")
    return exercises


def _write_exercises(conn: Connection, workout_id: int, exercises: list[ExerciseIn]) -> None:
    with conn.cursor() as cur:
        for position, exercise in enumerate(exercises):
            workout_exercise_id = cur.execute(
                "INSERT INTO workout_exercises (workout_id, exercise_id, position) VALUES (%s, %s, %s) RETURNING id",
                (workout_id, exercise.exercise_id, position),
            ).fetchone()[0]
            cur.executemany(
                "INSERT INTO sets (workout_exercise_id, position, reps, weight_kg, rpe) VALUES (%s, %s, %s, %s, %s)",
                [(workout_exercise_id, i, s.reps, s.weight_kg, s.rpe) for i, s in enumerate(exercise.sets)],
            )


def create_workout(conn: Connection, user_id: int, data: WorkoutIn, today: date) -> int:
    exercises = _check(conn, user_id, data, today)
    with conn.transaction():
        workout_id = conn.execute(
            "INSERT INTO workouts (user_id, workout_date, note, finished_at) VALUES (%s, %s, %s, %s) RETURNING id",
            (user_id, data.workout_date, data.note, datetime.now(UTC)),
        ).fetchone()[0]
        _write_exercises(conn, workout_id, exercises)
    return workout_id


def replace_workout(conn: Connection, user_id: int, workout_id: int, data: WorkoutIn, today: date) -> bool:
    """Writes a new version of the user's workout. False when it is missing or someone else's."""
    if conn.execute(f"SELECT 1 FROM workouts w WHERE w.id = %s AND w.user_id = %s AND {FINISHED}", (workout_id, user_id)).fetchone() is None:
        return False
    exercises = _check(conn, user_id, data, today, workout_id)
    with conn.transaction():
        conn.execute("UPDATE workouts SET workout_date = %s, note = %s WHERE id = %s", (data.workout_date, data.note, workout_id))
        conn.execute("DELETE FROM workout_exercises WHERE workout_id = %s", (workout_id,))
        _write_exercises(conn, workout_id, exercises)
    return True


def delete_workout(conn: Connection, user_id: int, workout_id: int) -> bool:
    row = conn.execute("DELETE FROM workouts WHERE id = %s AND user_id = %s RETURNING id", (workout_id, user_id)).fetchone()
    return row is not None


# History list


class WorkoutListItem(BaseModel):
    id: int
    workout_date: date
    exercises: list[str]
    sets: int
    # Polish names of the primary groups trained, most sets first.
    primary_groups: list[str]


class WorkoutPage(BaseModel):
    items: list[WorkoutListItem]
    # Pass as `after` for the next page; null on the last one.
    next: str | None


def _parse_cursor(cursor: str) -> tuple[date, int]:
    day, _, workout_id = cursor.partition("_")
    return date.fromisoformat(day), int(workout_id)


def list_workouts(conn: Connection, user_id: int, after: str | None = None, limit: int = PAGE_SIZE) -> WorkoutPage:
    """Newest first, `limit` at a time. Keyset paging stays fast however long the history gets."""
    day, last_id = _parse_cursor(after) if after else (date.max, 2**62)
    rows = conn.execute(
        f"""
        SELECT w.id, w.workout_date,
               ARRAY(SELECT COALESCE(NULLIF(e.name_pl, ''), e.name) FROM workout_exercises we
                     JOIN exercises e ON e.id = we.exercise_id WHERE we.workout_id = w.id ORDER BY we.position),
               (SELECT count(*) FROM sets s JOIN workout_exercises we ON we.id = s.workout_exercise_id
                WHERE we.workout_id = w.id),
               ARRAY(SELECT g.name_pl FROM workout_exercises we
                     JOIN sets s ON s.workout_exercise_id = we.id
                     JOIN exercise_muscle_groups m ON m.exercise_id = we.exercise_id AND m.role = 'primary'
                     JOIN muscle_groups g ON g.key = m.muscle_group_key
                     WHERE we.workout_id = w.id GROUP BY g.name_pl ORDER BY count(*) DESC, g.name_pl)
        FROM workouts w
        WHERE w.user_id = %s AND {FINISHED} AND (w.workout_date, w.id) < (%s, %s)
        ORDER BY w.workout_date DESC, w.id DESC
        LIMIT %s
        """,
        (user_id, day, last_id, limit + 1),
    ).fetchall()
    items = [
        WorkoutListItem(id=row[0], workout_date=row[1], exercises=list(row[2]), sets=row[3], primary_groups=list(row[4]))
        for row in rows[:limit]
    ]
    more = len(rows) > limit
    return WorkoutPage(items=items, next=f"{items[-1].workout_date.isoformat()}_{items[-1].id}" if more else None)


# The workout page


class WorkoutSet(BaseModel):
    reps: int
    weight_kg: float
    rpe: float | None


class WorkoutExercise(BaseModel):
    exercise_id: int
    name: str
    sets: list[WorkoutSet]


class WorkoutDetail(BaseModel):
    id: int
    workout_date: date
    note: str | None
    exercises: list[WorkoutExercise]
    effective_sets: float
    tonnage_kg: float
    # Groups the workout trained, most effective sets first. Groups it did not train are left out.
    groups: list[MuscleGroupTotal]


def get_workout(conn: Connection, user_id: int, workout_id: int) -> WorkoutDetail | None:
    """One finished workout of this user. Another user's workout is the same as a missing one."""
    workout = conn.execute(
        f"SELECT w.id, w.workout_date, w.note FROM workouts w WHERE w.id = %s AND w.user_id = %s AND {FINISHED}",
        (workout_id, user_id),
    ).fetchone()
    if workout is None:
        return None
    rows = conn.execute(
        """
        SELECT we.id, e.id, COALESCE(NULLIF(e.name_pl, ''), e.name), s.reps, s.weight_kg, s.rpe,
               ARRAY(SELECT m.muscle_group_key FROM exercise_muscle_groups m WHERE m.exercise_id = e.id AND m.role = 'primary'),
               ARRAY(SELECT m.muscle_group_key FROM exercise_muscle_groups m WHERE m.exercise_id = e.id AND m.role = 'secondary')
        FROM workout_exercises we
        JOIN exercises e ON e.id = we.exercise_id
        LEFT JOIN sets s ON s.workout_exercise_id = we.id
        WHERE we.workout_id = %s
        ORDER BY we.position, s.position
        """,
        (workout_id,),
    ).fetchall()
    exercises: dict[int, WorkoutExercise] = {}
    records: list[SetRecord] = []
    for workout_exercise_id, exercise_id, name, reps, weight_kg, rpe, primary, secondary in rows:
        exercise = exercises.setdefault(workout_exercise_id, WorkoutExercise(exercise_id=exercise_id, name=name, sets=[]))
        if reps is None:
            continue
        weight = float(weight_kg)
        exercise.sets.append(WorkoutSet(reps=reps, weight_kg=weight, rpe=float(rpe) if rpe is not None else None))
        records.append(SetRecord(workout_id, workout[1], reps, weight, tuple(primary), tuple(secondary)))

    effective = effective_sets_by_group(records)
    tonnage = tonnage_by_group(records)
    names = dict(conn.execute("SELECT key, name_pl FROM muscle_groups").fetchall())
    groups = [
        MuscleGroupTotal(key=key, name_pl=names[key], effective_sets=round(sets, 2), tonnage_kg=round(tonnage.get(key, 0), 2))
        for key, sets in effective.items()
    ]
    groups.sort(key=lambda g: (-g.effective_sets, -g.tonnage_kg, g.name_pl))
    return WorkoutDetail(
        id=workout[0],
        workout_date=workout[1],
        note=workout[2],
        exercises=list(exercises.values()),
        effective_sets=round(sum(effective.values()), 2),
        tonnage_kg=round(sum(r.reps * r.weight_kg for r in records), 2),
        groups=groups,
    )
