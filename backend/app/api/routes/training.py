from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from psycopg import Connection

from app.api.deps import CurrentUser, get_db
from app.metrics import today_in_warsaw
from app.training import (
    Home,
    InvalidRange,
    RangeKind,
    Summary,
    home,
    resolve_range,
    summarise,
)

router = APIRouter(prefix="/me", tags=["training"])

Db = Annotated[Connection, Depends(get_db)]


@router.get("/home", response_model=Home)
def read_home(user: CurrentUser, conn: Db):
    """The Start screen: the latest workout and this week (Monday to Sunday, Europe/Warsaw)."""
    return home(conn, user.id, today_in_warsaw())


@router.get("/summary", response_model=Summary)
def read_summary(
    user: CurrentUser,
    conn: Db,
    range_kind: Annotated[RangeKind, Query(alias="range")] = "this_week",
    start: Annotated[date | None, Query(alias="from")] = None,
    end: Annotated[date | None, Query(alias="to")] = None,
):
    """Workouts, effective sets and tonnage per muscle group over a range. `from` and `to` are for `range=custom`."""
    try:
        date_range = resolve_range(range_kind, today_in_warsaw(), start, end)
    except InvalidRange as error:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, str(error)) from None
    return summarise(conn, user.id, date_range)
