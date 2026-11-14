import logging
from functools import lru_cache
from typing import Any

import httpx
import jwt

from app.core.config import settings

logger = logging.getLogger(__name__)

CLERK_API_URL = "https://api.clerk.com/v1"


class InvalidTokenError(Exception):
    """The request's session token is missing a claim, expired, forged or from another app."""


@lru_cache
def _jwks_client(url: str) -> jwt.PyJWKClient:
    # Caches Clerk's signing keys, so only the first request (or a key rotation) fetches them.
    return jwt.PyJWKClient(url, cache_keys=True, lifespan=3600)


def _signing_key(token: str) -> Any:
    if settings.CLERK_JWT_KEY:
        return settings.CLERK_JWT_KEY
    if settings.CLERK_JWKS_URL:
        return _jwks_client(settings.CLERK_JWKS_URL).get_signing_key_from_jwt(token).key
    raise RuntimeError("Set CLERK_JWT_KEY or CLERK_JWKS_URL to verify Clerk session tokens.")


def verify_session_token(token: str) -> dict[str, Any]:
    """Return the claims of a valid Clerk session token, or raise InvalidTokenError."""
    try:
        claims = jwt.decode(
            token,
            _signing_key(token),
            algorithms=["RS256"],
            options={"require": ["exp", "nbf", "iat", "sub"]},
            # Clerk's own SDKs allow a few seconds of clock skew.
            leeway=5,
        )
    except jwt.PyJWTError as error:
        raise InvalidTokenError(str(error)) from error

    allowed = settings.CLERK_AUTHORIZED_PARTIES
    if allowed and claims.get("azp") not in allowed:
        raise InvalidTokenError(f"Token issued for {claims.get('azp')!r}")
    return claims


def fetch_primary_email(clerk_user_id: str) -> str | None:
    """The user's primary email from the Clerk Backend API, or None if it cannot be read."""
    if not settings.CLERK_SECRET_KEY:
        return None
    try:
        response = httpx.get(
            f"{CLERK_API_URL}/users/{clerk_user_id}",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
            timeout=5,
        )
        response.raise_for_status()
        user = response.json()
    except httpx.HTTPError:
        logger.warning("Could not read the email of Clerk user %s", clerk_user_id, exc_info=True)
        return None
    primary_id = user.get("primary_email_address_id")
    for address in user.get("email_addresses", []):
        if address.get("id") == primary_id:
            return address.get("email_address")
    return None
