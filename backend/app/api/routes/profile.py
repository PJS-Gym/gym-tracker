from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg import Connection

from app.api.deps import CurrentUser, get_db
from app.profiles import (
    Measurement,
    Onboarding,
    OnboardingAlreadyCompleted,
    Profile,
    ProfileUpdate,
    complete_onboarding,
    get_profile,
    list_measurements,
    update_profile,
)

router = APIRouter(prefix="/me", tags=["me"])

Db = Annotated[Connection, Depends(get_db)]


@router.get("/profile", response_model=Profile)
def read_profile(user: CurrentUser, conn: Db):
    return get_profile(conn, user.id)


@router.patch("/profile", response_model=Profile)
def patch_profile(update: ProfileUpdate, user: CurrentUser, conn: Db):
    return update_profile(conn, user.id, update)


@router.post("/onboarding", response_model=Profile)
def post_onboarding(onboarding: Onboarding, user: CurrentUser, conn: Db):
    try:
        return complete_onboarding(conn, user.id, onboarding)
    except OnboardingAlreadyCompleted:
        raise HTTPException(status.HTTP_409_CONFLICT, "Onboarding already completed") from None


@router.get("/measurements", response_model=list[Measurement])
def read_measurements(user: CurrentUser, conn: Db):
    return list_measurements(conn, user.id)
