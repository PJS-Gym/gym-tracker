"""The user's profile and settings, and their body measurements (#18).

Limits mirror frontend/src/features/onboarding/validation.ts.
"""

from datetime import date, datetime, timedelta
from typing import Annotated, Literal

from psycopg import Connection
from pydantic import AfterValidator, BaseModel, ConfigDict, Field, model_validator

Sex = Literal["female", "male", "undisclosed"]

MIN_AGE, MAX_AGE = 13, 100
MAX_DISPLAY_NAME = 40


def _clean_display_name(value: str | None) -> str | None:
    """Trims the name and treats a blank one as no name. Length is checked here because `null` is allowed."""
    if value is None:
        return None
    value = value.strip()
    if len(value) > MAX_DISPLAY_NAME:
        raise ValueError(f"display_name must be at most {MAX_DISPLAY_NAME} characters")
    return value or None


def _age_on(birth: date, today: date) -> int:
    return today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))


def _check_birth_date(value: date | None) -> date | None:
    if value is None:
        return None
    # The browser checks against the user's local day; allow a day either way for time zones.
    today = date.today()
    if _age_on(value, today + timedelta(days=1)) < MIN_AGE or _age_on(value, today - timedelta(days=1)) > MAX_AGE:
        raise ValueError(f"age must be between {MIN_AGE} and {MAX_AGE}")
    return value


def _check_recent(value: date) -> date:
    # A measurement is dated today in the user's time zone, which may be a day off the server's.
    if abs((value - date.today()).days) > 1:
        raise ValueError("measured_on must be today")
    return value


DisplayName = Annotated[str | None, AfterValidator(_clean_display_name)]
BirthDate = Annotated[date | None, AfterValidator(_check_birth_date)]
HeightCm = Annotated[float | None, Field(ge=100, le=250)]
MassKg = Annotated[float | None, Field(ge=30, le=300)]
CircumferenceCm = Annotated[float | None, Field(ge=40, le=200)]


class Profile(BaseModel):
    display_name: str | None
    birth_date: date | None
    sex: Sex | None
    height_cm: float | None
    onboarded_at: datetime | None
    weekly_report_email: bool


class ProfileUpdate(BaseModel):
    """Only the fields sent are changed. `null` clears a profile field."""

    model_config = ConfigDict(extra="forbid")

    display_name: DisplayName = None
    birth_date: BirthDate = None
    sex: Sex | None = None
    height_cm: HeightCm = None
    weekly_report_email: bool | None = None

    @model_validator(mode="after")
    def _setting_is_not_null(self):
        if "weekly_report_email" in self.model_fields_set and self.weekly_report_email is None:
            raise ValueError("weekly_report_email cannot be null")
        return self


class MeasurementIn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    measured_on: Annotated[date, AfterValidator(_check_recent)]
    mass_kg: MassKg = None
    chest_cm: CircumferenceCm = None
    hips_cm: CircumferenceCm = None

    @model_validator(mode="after")
    def _has_a_value(self):
        if self.mass_kg is None and self.chest_cm is None and self.hips_cm is None:
            raise ValueError("a measurement needs mass, chest or hips")
        return self


class Measurement(BaseModel):
    id: int
    measured_on: date
    mass_kg: float | None
    chest_cm: float | None
    hips_cm: float | None


class Onboarding(BaseModel):
    """Everything is optional; skipping all of it still completes onboarding."""

    model_config = ConfigDict(extra="forbid")

    display_name: DisplayName = None
    birth_date: BirthDate = None
    sex: Sex | None = None
    height_cm: HeightCm = None
    first_measurement: MeasurementIn | None = None


class OnboardingAlreadyCompleted(Exception):
    pass


_PROFILE_COLUMNS = ("display_name", "birth_date", "sex", "height_cm", "onboarded_at", "weekly_report_email")
_MEASUREMENT_COLUMNS = ("id", "measured_on", "mass_kg", "chest_cm", "hips_cm")


def _to_profile(row: tuple) -> Profile:
    return Profile(**dict(zip(_PROFILE_COLUMNS, row)))


def get_profile(conn: Connection, user_id: int) -> Profile:
    row = conn.execute(f"select {', '.join(_PROFILE_COLUMNS)} from users where id = %s", (user_id,)).fetchone()
    return _to_profile(row)


def update_profile(conn: Connection, user_id: int, update: ProfileUpdate) -> Profile:
    changes = update.model_dump(exclude_unset=True)
    if not changes:
        return get_profile(conn, user_id)
    # Column names come from the model's fields, never from the request.
    assignments = ", ".join(f"{column} = %({column})s" for column in changes)
    row = conn.execute(
        f"update users set {assignments} where id = %(id)s returning {', '.join(_PROFILE_COLUMNS)}",
        {**changes, "id": user_id},
    ).fetchone()
    return _to_profile(row)


def complete_onboarding(conn: Connection, user_id: int, onboarding: Onboarding) -> Profile:
    """Saves the profile and first measurement and marks onboarding done, all or nothing.

    Raises OnboardingAlreadyCompleted on a second call, so onboarding happens once.
    """
    with conn.transaction():
        row = conn.execute(
            f"update users set display_name = %s, birth_date = %s, sex = %s, height_cm = %s, onboarded_at = now() "
            f"where id = %s and onboarded_at is null returning {', '.join(_PROFILE_COLUMNS)}",
            (onboarding.display_name, onboarding.birth_date, onboarding.sex, onboarding.height_cm, user_id),
        ).fetchone()
        if row is None:
            raise OnboardingAlreadyCompleted
        if onboarding.first_measurement:
            add_measurement(conn, user_id, onboarding.first_measurement)
    return _to_profile(row)


def add_measurement(conn: Connection, user_id: int, measurement: MeasurementIn) -> Measurement:
    row = conn.execute(
        "insert into body_measurements (user_id, measured_on, mass_kg, chest_cm, hips_cm) "
        f"values (%s, %s, %s, %s, %s) returning {', '.join(_MEASUREMENT_COLUMNS)}",
        (user_id, measurement.measured_on, measurement.mass_kg, measurement.chest_cm, measurement.hips_cm),
    ).fetchone()
    return Measurement(**dict(zip(_MEASUREMENT_COLUMNS, row)))


def list_measurements(conn: Connection, user_id: int) -> list[Measurement]:
    rows = conn.execute(
        f"select {', '.join(_MEASUREMENT_COLUMNS)} from body_measurements "
        "where user_id = %s order by measured_on desc, id desc",
        (user_id,),
    ).fetchall()
    return [Measurement(**dict(zip(_MEASUREMENT_COLUMNS, row))) for row in rows]
