"""Keep the dataset's category of each shared exercise, shown on the exercise page (#9).

Revision ID: 0003
Revises: 0002
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0003"
down_revision: str | None = "0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("ALTER TABLE exercises ADD COLUMN category text")


def downgrade() -> None:
    op.execute("ALTER TABLE exercises DROP COLUMN category")
