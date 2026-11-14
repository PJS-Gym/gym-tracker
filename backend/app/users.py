from collections.abc import Callable
from datetime import datetime

from psycopg import Connection
from pydantic import BaseModel


class User(BaseModel):
    id: int
    clerk_id: str
    email: str | None
    created_at: datetime


_COLUMNS = "id, clerk_id, email, created_at"


def _to_user(row: tuple) -> User:
    return User(**dict(zip(("id", "clerk_id", "email", "created_at"), row)))


def get_or_create_user(conn: Connection, clerk_id: str, load_email: Callable[[], str | None]) -> User:
    """Return the user with this Clerk id, creating the record on their first request.

    `load_email` runs only for a new user. The unique `clerk_id` keeps concurrent first
    requests from creating two records.
    """
    row = conn.execute(f"select {_COLUMNS} from users where clerk_id = %s", (clerk_id,)).fetchone()
    if row:
        return _to_user(row)

    row = conn.execute(
        f"insert into users (clerk_id, email) values (%s, %s) "
        f"on conflict (clerk_id) do nothing returning {_COLUMNS}",
        (clerk_id, load_email()),
    ).fetchone()
    if row is None:
        # Another request created it between our select and insert.
        row = conn.execute(f"select {_COLUMNS} from users where clerk_id = %s", (clerk_id,)).fetchone()
    return _to_user(row)
