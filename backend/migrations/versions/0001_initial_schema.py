"""Create the v1 data model and the fixed list of muscle groups.

`users` and `body_measurements` already exist on the production database but
were never in the repo. They are created here with IF NOT EXISTS, in exactly
their current shape, so a clean database ends up identical.

Revision ID: 0001
Revises:
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

MUSCLE_GROUPS = [
    ("chest", "klatka piersiowa"),
    ("upper_back", "górna część pleców"),
    ("lats", "najszersze grzbietu"),
    ("traps", "kaptury"),
    ("lower_back", "dolna część pleców"),
    ("shoulders", "barki"),
    ("biceps", "biceps"),
    ("triceps", "triceps"),
    ("forearms", "przedramiona"),
    ("abs", "brzuch"),
    ("glutes", "pośladki"),
    ("quads", "czworogłowe uda"),
    ("hamstrings", "dwugłowe uda"),
    ("calves", "łydki"),
    ("adductors", "przywodziciele"),
    ("abductors", "odwodziciele"),
    ("neck", "szyja"),
]

CREATE_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS users (
        id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        clerk_id            text NOT NULL UNIQUE,
        email               text,
        created_at          timestamptz NOT NULL DEFAULT now(),
        display_name        text CHECK (char_length(display_name) BETWEEN 1 AND 40),
        birth_date          date,
        sex                 text CHECK (sex IN ('female', 'male', 'undisclosed')),
        height_cm           numeric(4, 1) CHECK (height_cm BETWEEN 100 AND 250),
        onboarded_at        timestamptz,
        weekly_report_email boolean NOT NULL DEFAULT true
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS body_measurements (
        id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id     bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        measured_on date NOT NULL,
        mass_kg     numeric(4, 1) CHECK (mass_kg BETWEEN 30 AND 300),
        chest_cm    numeric(4, 1) CHECK (chest_cm BETWEEN 40 AND 200),
        hips_cm     numeric(4, 1) CHECK (hips_cm BETWEEN 40 AND 200),
        created_at  timestamptz NOT NULL DEFAULT now(),
        CHECK (mass_kg IS NOT NULL OR chest_cm IS NOT NULL OR hips_cm IS NOT NULL)
    )
    """,
    """
    CREATE INDEX IF NOT EXISTS body_measurements_user_day
        ON body_measurements (user_id, measured_on DESC, id DESC)
    """,
    """
    CREATE TABLE muscle_groups (
        key     text PRIMARY KEY,
        name_pl text NOT NULL
    )
    """,
    # A shared exercise comes from a source and has no owner.
    # A user's own exercise has an owner and no source.
    """
    CREATE TABLE exercises (
        id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name       text NOT NULL,
        name_pl    text,
        equipment  text,
        user_id    bigint REFERENCES users (id) ON DELETE CASCADE,
        source     text,
        source_id  text,
        deleted_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT exercises_source_unique UNIQUE (source, source_id),
        CONSTRAINT exercises_shared_or_own CHECK (
            (user_id IS NULL AND source IS NOT NULL AND source_id IS NOT NULL)
            OR (user_id IS NOT NULL AND source IS NULL AND source_id IS NULL)
        )
    )
    """,
    "CREATE INDEX exercises_user_id_idx ON exercises (user_id) WHERE user_id IS NOT NULL",
    """
    CREATE TABLE exercise_muscle_groups (
        exercise_id      bigint NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
        muscle_group_key text NOT NULL REFERENCES muscle_groups (key),
        role             text NOT NULL CHECK (role IN ('primary', 'secondary')),
        PRIMARY KEY (exercise_id, muscle_group_key)
    )
    """,
    "CREATE INDEX exercise_muscle_groups_key_idx ON exercise_muscle_groups (muscle_group_key)",
    """
    CREATE TABLE workouts (
        id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id      bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        workout_date date NOT NULL,
        note         text,
        finished_at  timestamptz,
        created_at   timestamptz NOT NULL DEFAULT now()
    )
    """,
    "CREATE INDEX workouts_user_date_idx ON workouts (user_id, workout_date)",
    # Position constraints are deferred so a reorder can swap two rows in one transaction.
    # The exercise reference is deferred so deleting a user can remove their own exercises
    # before the cascade through workouts has removed the rows that point at them.
    """
    CREATE TABLE workout_exercises (
        id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        workout_id  bigint NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
        exercise_id bigint NOT NULL REFERENCES exercises (id)
            DEFERRABLE INITIALLY DEFERRED,
        position    integer NOT NULL,
        CONSTRAINT workout_exercises_position_unique UNIQUE (workout_id, position)
            DEFERRABLE INITIALLY DEFERRED
    )
    """,
    "CREATE INDEX workout_exercises_exercise_idx ON workout_exercises (exercise_id)",
    """
    CREATE TABLE sets (
        id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        workout_exercise_id bigint NOT NULL REFERENCES workout_exercises (id) ON DELETE CASCADE,
        position            integer NOT NULL,
        reps                integer NOT NULL CHECK (reps BETWEEN 1 AND 100),
        weight_kg           numeric(6, 2) NOT NULL CHECK (weight_kg BETWEEN 0 AND 1000),
        rpe                 numeric(3, 1) CHECK (rpe BETWEEN 1 AND 10),
        CONSTRAINT sets_position_unique UNIQUE (workout_exercise_id, position)
            DEFERRABLE INITIALLY DEFERRED
    )
    """,
    """
    CREATE TABLE reports (
        id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id    bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        week_start date NOT NULL CHECK (EXTRACT(ISODOW FROM week_start) = 1),
        status     text NOT NULL DEFAULT 'pending'
            CHECK (status IN ('pending', 'ready', 'failed')),
        snapshot   jsonb,
        issued_at  timestamptz,
        opened_at  timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT reports_user_week_unique UNIQUE (user_id, week_start),
        CONSTRAINT reports_ready_has_snapshot CHECK (
            status <> 'ready' OR (snapshot IS NOT NULL AND issued_at IS NOT NULL)
        )
    )
    """,
]

# `users` and `body_measurements` stay: they predate this migration and hold real data.
DROPPED_TABLES = [
    "reports",
    "sets",
    "workout_exercises",
    "workouts",
    "exercise_muscle_groups",
    "exercises",
    "muscle_groups",
]


def upgrade() -> None:
    for statement in CREATE_STATEMENTS:
        op.execute(statement)

    values = ", ".join(f"('{key}', '{name_pl}')" for key, name_pl in MUSCLE_GROUPS)
    op.execute(f"INSERT INTO muscle_groups (key, name_pl) VALUES {values}")


def downgrade() -> None:
    for table in DROPPED_TABLES:
        op.execute(f"DROP TABLE {table}")
