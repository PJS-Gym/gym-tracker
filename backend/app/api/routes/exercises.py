from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from psycopg import Connection

from app.api.deps import CurrentUser, get_db
from app.exercises import (
    Catalogue,
    ExerciseDetail,
    ExerciseIn,
    History,
    LastSet,
    UnknownMuscleGroup,
    catalogue,
    create_exercise,
    delete_exercise,
    get_exercise,
    history,
    last_sets,
    update_exercise,
)

router = APIRouter(prefix="/me/exercises", tags=["exercises"])

Db = Annotated[Connection, Depends(get_db)]


def _not_found() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, "Exercise not found")


@router.get("", response_model=Catalogue)
def read_catalogue(user: CurrentUser, conn: Db):
    """Shared exercises and the user's own, with the muscle groups and equipment to filter by."""
    return catalogue(conn, user.id)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ExerciseDetail)
def add_exercise(data: ExerciseIn, user: CurrentUser, conn: Db):
    try:
        exercise_id = create_exercise(conn, user.id, data)
    except UnknownMuscleGroup as error:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, str(error)) from None
    return get_exercise(conn, user.id, exercise_id)


@router.get("/last", response_model=list[LastSet])
def read_last_sets(
    user: CurrentUser,
    conn: Db,
    ids: Annotated[list[int], Query(alias="id", max_length=50)],
    before: date,
    exclude: int | None = None,
):
    """"Ostatnio" for each exercise: the best set of the latest workout before `before` (and not `exclude`)."""
    return last_sets(conn, user.id, ids, before, exclude)


@router.get("/{exercise_id}", response_model=ExerciseDetail)
def read_exercise(exercise_id: int, user: CurrentUser, conn: Db):
    exercise = get_exercise(conn, user.id, exercise_id)
    if exercise is None:
        raise _not_found()
    return exercise


@router.get("/{exercise_id}/history", response_model=History)
def read_history(exercise_id: int, user: CurrentUser, conn: Db):
    if get_exercise(conn, user.id, exercise_id) is None:
        raise _not_found()
    return history(conn, user.id, exercise_id)


def _own_or_refuse(conn: Connection, user_id: int, exercise_id: int) -> None:
    """404 when the user cannot see it, 403 for a shared or deleted one they can see but not change."""
    exercise = get_exercise(conn, user_id, exercise_id)
    if exercise is None:
        raise _not_found()
    if not exercise.own or exercise.deleted:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only your own exercises can be changed")


@router.put("/{exercise_id}", response_model=ExerciseDetail)
def change_exercise(exercise_id: int, data: ExerciseIn, user: CurrentUser, conn: Db):
    _own_or_refuse(conn, user.id, exercise_id)
    try:
        update_exercise(conn, user.id, exercise_id, data)
    except UnknownMuscleGroup as error:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, str(error)) from None
    return get_exercise(conn, user.id, exercise_id)


@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_exercise(exercise_id: int, user: CurrentUser, conn: Db):
    _own_or_refuse(conn, user.id, exercise_id)
    delete_exercise(conn, user.id, exercise_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
