"""Metric rules from #6 that the live screens need: effective sets, tonnage, e1RM and the week.

Pure functions over sets, with no database access, so the live screens (#14, #16) and the
weekly report (#19) can share them. #6 owns the full set of rules; this is the part the Start
and Podsumowanie screens use.
"""

from collections import defaultdict
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from zoneinfo import ZoneInfo

# Weeks run Monday 00:00 to Sunday 23:59 in this zone.
WARSAW = ZoneInfo("Europe/Warsaw")


@dataclass(frozen=True)
class SetRecord:
    """One logged set with the muscle groups of its exercise."""

    workout_id: int
    workout_date: date
    reps: int
    weight_kg: float
    primary: tuple[str, ...]
    secondary: tuple[str, ...]


def effective_sets_by_group(sets: Iterable[SetRecord]) -> dict[str, float]:
    """Every set adds 1 to each primary muscle group of its exercise and 0.5 to each secondary one."""
    totals: dict[str, float] = defaultdict(float)
    for record in sets:
        for group in record.primary:
            totals[group] += 1
        for group in record.secondary:
            totals[group] += 0.5
    return dict(totals)


def tonnage_by_group(sets: Iterable[SetRecord]) -> dict[str, float]:
    """Reps times kg, given in full to each primary muscle group and never to secondary ones.

    A set at 0 kg has no tonnage, but it still counts as an effective set.
    """
    totals: dict[str, float] = defaultdict(float)
    for record in sets:
        tonnage = record.reps * record.weight_kg
        for group in record.primary:
            totals[group] += tonnage
    return dict(totals)


# Only sets that say something about strength estimate a one-rep max.
E1RM_MAX_REPS = 12
E1RM_MIN_RPE = 7


def e1rm(reps: int, weight_kg: float, rpe: float | None = None) -> float | None:
    """Estimated one-rep max of a set (Epley): kg × (1 + reps / 30), the weight itself at 1 rep.

    Only sets above 0 kg, of 1 to 12 reps and with RPE 7 or more (or no RPE) count; others give None.
    """
    if weight_kg <= 0 or not 1 <= reps <= E1RM_MAX_REPS or (rpe is not None and rpe < E1RM_MIN_RPE):
        return None
    return weight_kg if reps == 1 else weight_kg * (1 + reps / 30)


def today_in_warsaw(now: datetime | None = None) -> date:
    """The calendar day it is in Europe/Warsaw."""
    return (now or datetime.now(UTC)).astimezone(WARSAW).date()


def week_of(day: date) -> tuple[date, date]:
    """Monday and Sunday of the week a day falls in. A workout belongs to the week of its date."""
    monday = day - timedelta(days=day.weekday())
    return monday, monday + timedelta(days=6)
