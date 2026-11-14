"""Reading a user's finished workouts for the Start and Podsumowanie screens."""

from datetime import date, timedelta
from typing import Literal

from psycopg import Connection
from pydantic import BaseModel

from app.metrics import SetRecord, effective_sets_by_group, tonnage_by_group, week_of

# A workout counts once it is finished. The logger (#11) only ever writes finished ones.
FINISHED = "w.finished_at IS NOT NULL"

RangeKind = Literal["this_week", "last_week", "last_4_weeks", "custom"]

# A custom range longer than this is almost certainly a mistake, and it keeps the query small.
MAX_CUSTOM_DAYS = 366


class InvalidRange(ValueError):
    pass


class DateRange(BaseModel):
    kind: RangeKind
    start: date
    end: date


def resolve_range(kind: RangeKind, today: date, start: date | None = None, end: date | None = None) -> DateRange:
    """The dates a range covers. "Last 4 weeks" is this week and the 3 before it."""
    monday, sunday = week_of(today)
    if kind == "this_week":
        return DateRange(kind=kind, start=monday, end=sunday)
    if kind == "last_week":
        return DateRange(kind=kind, start=monday - timedelta(weeks=1), end=monday - timedelta(days=1))
    if kind == "last_4_weeks":
        return DateRange(kind=kind, start=monday - timedelta(weeks=3), end=sunday)
    if start is None or end is None:
        raise InvalidRange("A custom range needs a start and an end")
    if end < start:
        raise InvalidRange("The end cannot be earlier than the start")
    if (end - start).days >= MAX_CUSTOM_DAYS:
        raise InvalidRange(f"A custom range can cover at most {MAX_CUSTOM_DAYS} days")
    return DateRange(kind=kind, start=start, end=end)


def load_sets(conn: Connection, user_id: int, start: date, end: date) -> list[SetRecord]:
    """Every set of the user's finished workouts dated within the range, with its muscle groups.

    A soft-deleted exercise still counts, so deleting it does not change past statistics.
    """
    rows = conn.execute(
        f"""
        SELECT w.id, w.workout_date, s.reps, s.weight_kg,
               COALESCE(array_agg(m.muscle_group_key) FILTER (WHERE m.role = 'primary'), '{{}}'),
               COALESCE(array_agg(m.muscle_group_key) FILTER (WHERE m.role = 'secondary'), '{{}}')
        FROM workouts w
        JOIN workout_exercises we ON we.workout_id = w.id
        JOIN sets s ON s.workout_exercise_id = we.id
        LEFT JOIN exercise_muscle_groups m ON m.exercise_id = we.exercise_id
        WHERE w.user_id = %s AND w.workout_date BETWEEN %s AND %s AND {FINISHED}
        GROUP BY s.id, w.id
        """,
        (user_id, start, end),
    ).fetchall()
    return [
        SetRecord(
            workout_id=row[0],
            workout_date=row[1],
            reps=row[2],
            weight_kg=float(row[3]),
            primary=tuple(row[4]),
            secondary=tuple(row[5]),
        )
        for row in rows
    ]


def workout_days(conn: Connection, user_id: int, start: date, end: date) -> list[tuple[int, date]]:
    """(workout id, date) of every finished workout in the range, including ones with no sets."""
    return conn.execute(
        f"SELECT w.id, w.workout_date FROM workouts w WHERE w.user_id = %s AND w.workout_date BETWEEN %s AND %s AND {FINISHED}",
        (user_id, start, end),
    ).fetchall()


class MuscleGroupTotal(BaseModel):
    key: str
    name_pl: str
    effective_sets: float
    tonnage_kg: float


class Summary(BaseModel):
    range: DateRange
    workouts: int
    # All 17 groups: most effective sets first, groups with none at the end.
    groups: list[MuscleGroupTotal]


def summarise(conn: Connection, user_id: int, date_range: DateRange) -> Summary:
    sets = load_sets(conn, user_id, date_range.start, date_range.end)
    effective = effective_sets_by_group(sets)
    tonnage = tonnage_by_group(sets)
    groups = [
        MuscleGroupTotal(
            key=key,
            name_pl=name_pl,
            effective_sets=round(effective.get(key, 0), 2),
            tonnage_kg=round(tonnage.get(key, 0), 2),
        )
        for key, name_pl in conn.execute("SELECT key, name_pl FROM muscle_groups").fetchall()
    ]
    groups.sort(key=lambda g: (-g.effective_sets, -g.tonnage_kg, g.name_pl))
    return Summary(range=date_range, workouts=len(workout_days(conn, user_id, date_range.start, date_range.end)), groups=groups)


class LastWorkout(BaseModel):
    id: int
    workout_date: date
    exercises: int
    sets: int


class WeekDay(BaseModel):
    date: date
    trained: bool


class Week(BaseModel):
    start: date
    end: date
    workouts: int
    effective_sets: float
    days: list[WeekDay]


class Home(BaseModel):
    """What the Start screen shows. `last_workout` is null for someone who has not trained yet."""

    last_workout: LastWorkout | None
    week: Week


def last_workout(conn: Connection, user_id: int) -> LastWorkout | None:
    row = conn.execute(
        f"""
        SELECT w.id, w.workout_date,
               (SELECT count(*) FROM workout_exercises we WHERE we.workout_id = w.id),
               (SELECT count(*) FROM sets s JOIN workout_exercises we ON we.id = s.workout_exercise_id
                WHERE we.workout_id = w.id)
        FROM workouts w
        WHERE w.user_id = %s AND {FINISHED}
        ORDER BY w.workout_date DESC, w.finished_at DESC, w.id DESC
        LIMIT 1
        """,
        (user_id,),
    ).fetchone()
    return LastWorkout(id=row[0], workout_date=row[1], exercises=row[2], sets=row[3]) if row else None


def home(conn: Connection, user_id: int, today: date) -> Home:
    monday, sunday = week_of(today)
    sets = load_sets(conn, user_id, monday, sunday)
    trained = workout_days(conn, user_id, monday, sunday)
    trained_dates = {day for _, day in trained}
    return Home(
        last_workout=last_workout(conn, user_id),
        week=Week(
            start=monday,
            end=sunday,
            workouts=len(trained),
            # A set's effective sets summed over its muscle groups, the same total as the report.
            effective_sets=round(sum(effective_sets_by_group(sets).values()), 2),
            days=[WeekDay(date=monday + timedelta(days=i), trained=monday + timedelta(days=i) in trained_dates) for i in range(7)],
        ),
    )
