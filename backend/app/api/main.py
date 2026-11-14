from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.api.routes import exercises, health, items, me, profile, training, workouts

api_router = APIRouter()

# Open to anyone.
api_router.include_router(health.router)
api_router.include_router(items.router)

# Everything here needs a valid Clerk session token (401 otherwise). Add new routes to this router.
protected_router = APIRouter(dependencies=[Depends(get_current_user)])
protected_router.include_router(me.router)
protected_router.include_router(profile.router)
protected_router.include_router(training.router)
protected_router.include_router(exercises.router)
protected_router.include_router(workouts.router)
api_router.include_router(protected_router)
