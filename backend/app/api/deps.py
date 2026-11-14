from collections.abc import Iterator
from datetime import datetime, timezone
from typing import Annotated, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from psycopg import Connection

from app.core.auth import InvalidTokenError, fetch_primary_email, verify_session_token
from app.core.db import get_pool
from app.users import User, get_or_create_user


def get_timestamp() -> str:
    """Return the current UTC timestamp in ISO 8601 format."""
    return datetime.now(timezone.utc).isoformat()


def get_db() -> Iterator[Connection]:
    """A pooled connection for the length of the request."""
    with get_pool().connection() as conn:
        yield conn


_bearer = HTTPBearer(auto_error=False, description="Clerk session token")


def _unauthorized(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_token_claims(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> dict[str, Any]:
    """Claims of the request's Clerk session token. 401 when it is missing or invalid."""
    if credentials is None:
        raise _unauthorized("Missing bearer token")
    try:
        return verify_session_token(credentials.credentials)
    except InvalidTokenError:
        raise _unauthorized("Invalid or expired token") from None


def get_current_user(
    # Declared before the connection, so a request without a valid token never touches the database.
    claims: Annotated[dict[str, Any], Depends(get_token_claims)],
    conn: Annotated[Connection, Depends(get_db)],
) -> User:
    """The signed-in user, created on their first request."""
    clerk_id = claims["sub"]
    # A session token customized with {"email": "{{user.primary_email_address}}"} saves the API call.
    return get_or_create_user(conn, clerk_id, lambda: claims.get("email") or fetch_primary_email(clerk_id))


CurrentUser = Annotated[User, Depends(get_current_user)]
