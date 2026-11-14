"""#14: "last week" on the demo account matches the hand-calculated example.

The sample report for the demo's last week (app/seed/demo_reports/with_body.json) was worked
out by hand from the demo plan using the rules in #6. The live summary has to agree with it.
Needs the shared exercises from free-exercise-db in TEST_DATABASE_URL (the import downloads
them), so it is skipped on a database without them.
"""

import json
from pathlib import Path

import pytest

from app.metrics import today_in_warsaw
from app.seed.demo import CLERK_ID, create_demo_account
from app.seed.import_exercises import SOURCE
from tests.conftest import make_token

REPORT = Path(__file__).resolve().parents[1] / "app" / "seed" / "demo_reports" / "with_body.json"


def test_last_week_on_the_demo_account_matches_the_hand_calculation(client, db):
    if db.execute("SELECT count(*) FROM exercises WHERE source = %s", (SOURCE,)).fetchone()[0] == 0:
        pytest.skip("Shared exercises are not imported: uv run python -m app.seed.import_exercises")
    create_demo_account(db, today_in_warsaw())
    report = json.loads(REPORT.read_text())

    body = client.get(
        "/api/v1/me/summary?range=last_week", headers={"Authorization": f"Bearer {make_token(sub=CLERK_ID)}"}
    ).json()

    assert body["workouts"] == report["summary"]["workouts"]
    live = {group["key"]: (group["effective_sets"], group["tonnage_kg"]) for group in body["groups"]}
    by_hand = {group["key"]: (group["effective_sets"], group["tonnage_kg"]) for group in report["muscle_map"]["groups"]}
    assert live == by_hand
