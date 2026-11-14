from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from psycopg import Connection

from app.api.deps import CurrentUser, get_db
from app.metrics import today_in_warsaw
from app.workouts import (
    InvalidWorkout,
    WorkoutDetail,
    WorkoutIn,
    WorkoutPage,
    create_workout,
    delete_workout,
    get_workout,
    list_workouts,
    replace_workout,
)

router = APIRouter(prefix="/me/workouts", tags=["workouts"])

Db = Annotated[Connection, Depends(get_db)]


def _not_found() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, "Workout not found")


def _invalid(error: InvalidWorkout) -> HTTPException:
    return HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, str(error))


@router.get("", response_model=WorkoutPage)
def read_workouts(
    user: CurrentUser,
    conn: Db,
    after: Annotated[str | None, Query(pattern=r"^\d{4}-\d{2}-\d{2}_\d+$")] = None,
):
    """Finished workouts, newest first, 20 at a time. Pass the previous page's `next` as `after`."""
    return list_workouts(conn, user.id, after)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=WorkoutDetail)
def add_workout(data: WorkoutIn, user: CurrentUser, conn: Db):
    """Saves a finished workout. It needs at least one set and cannot be dated after today (Europe/Warsaw)."""
    try:
        workout_id = create_workout(conn, user.id, data, today_in_warsaw())
    except InvalidWorkout as error:
        raise _invalid(error) from None
    return get_workout(conn, user.id, workout_id)


@router.get("/{workout_id}", response_model=WorkoutDetail)
def read_workout(workout_id: int, user: CurrentUser, conn: Db):
    workout = get_workout(conn, user.id, workout_id)
    if workout is None:
        raise _not_found()
    return workout


@router.put("/{workout_id}", response_model=WorkoutDetail)
def change_workout(workout_id: int, data: WorkoutIn, user: CurrentUser, conn: Db):
    try:
        found = replace_workout(conn, user.id, workout_id, data, today_in_warsaw())
    except InvalidWorkout as error:
        raise _invalid(error) from None
    if not found:
        raise _not_found()
    return get_workout(conn, user.id, workout_id)


@router.delete("/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_workout(workout_id: int, user: CurrentUser, conn: Db):
    if not delete_workout(conn, user.id, workout_id):
        raise _not_found()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
