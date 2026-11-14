from datetime import UTC, date, datetime

import pytest

from app.metrics import (
    SetRecord,
    e1rm,
    effective_sets_by_group,
    today_in_warsaw,
    tonnage_by_group,
    week_of,
)


def a_set(reps=10, kg=50.0, primary=("chest",), secondary=()):
    return SetRecord(workout_id=1, workout_date=date(2026, 11, 9), reps=reps, weight_kg=kg, primary=primary, secondary=secondary)


def test_a_set_counts_1_for_primary_and_half_for_secondary():
    sets = [a_set(primary=("chest",), secondary=("triceps", "shoulders"))] * 3
    assert effective_sets_by_group(sets) == {"chest": 3, "triceps": 1.5, "shoulders": 1.5}


def test_two_primary_groups_each_get_the_full_set_and_tonnage():
    sets = [a_set(reps=5, kg=100, primary=("quads", "glutes"))]
    assert effective_sets_by_group(sets) == {"quads": 1, "glutes": 1}
    assert tonnage_by_group(sets) == {"quads": 500, "glutes": 500}


def test_tonnage_goes_to_primary_groups_only():
    # 8 × 60 + 6 × 70 = 900 kg, none of it to the secondary group.
    sets = [a_set(reps=8, kg=60, secondary=("triceps",)), a_set(reps=6, kg=70, secondary=("triceps",))]
    assert tonnage_by_group(sets) == {"chest": 900}


def test_a_set_at_0_kg_counts_as_effective_but_has_no_tonnage():
    sets = [a_set(reps=12, kg=0, primary=("lats",))]
    assert effective_sets_by_group(sets) == {"lats": 1}
    assert tonnage_by_group(sets) == {"lats": 0}


def test_no_sets_means_no_groups():
    assert effective_sets_by_group([]) == {}
    assert tonnage_by_group([]) == {}


def test_a_week_runs_monday_to_sunday():
    assert week_of(date(2026, 11, 13)) == (date(2026, 11, 9), date(2026, 11, 15))  # a Friday
    assert week_of(date(2026, 11, 9)) == (date(2026, 11, 9), date(2026, 11, 15))  # the Monday
    assert week_of(date(2026, 11, 15)) == (date(2026, 11, 9), date(2026, 11, 15))  # the Sunday


def test_today_is_the_day_in_warsaw():
    # Sunday 23:30 in Warsaw (22:30 UTC) is still Sunday, so it belongs to the week ending that day.
    assert today_in_warsaw(datetime(2026, 11, 15, 22, 30, tzinfo=UTC)) == date(2026, 11, 15)
    # 23:30 UTC on that Sunday is already 00:30 on Monday in Warsaw: a new week.
    assert today_in_warsaw(datetime(2026, 11, 15, 23, 30, tzinfo=UTC)) == date(2026, 11, 16)


def test_e1rm_follows_epley():
    # 100 kg × (1 + 8 / 30) = 126.67 kg.
    assert e1rm(8, 100) == pytest.approx(126.667, abs=0.001)
    assert e1rm(5, 82.5, rpe=8) == pytest.approx(96.25)


def test_e1rm_at_one_rep_is_the_weight():
    assert e1rm(1, 140) == 140


@pytest.mark.parametrize(
    ("reps", "kg", "rpe"),
    [(8, 0, None), (13, 60, None), (5, 60, 6.5), (0, 60, None)],
    ids=["0 kg", "13 reps", "RPE 6.5", "0 reps"],
)
def test_sets_that_do_not_count_for_e1rm(reps, kg, rpe):
    assert e1rm(reps, kg, rpe) is None


def test_a_set_without_rpe_and_one_at_rpe_7_count():
    assert e1rm(12, 50) == pytest.approx(70)
    assert e1rm(12, 50, rpe=7) == pytest.approx(70)
