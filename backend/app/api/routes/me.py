from fastapi import APIRouter

from app.api.deps import CurrentUser
from app.users import User

router = APIRouter(prefix="/me", tags=["me"])


@router.get("", response_model=User)
def read_me(user: CurrentUser):
    return user
