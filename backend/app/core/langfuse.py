from langfuse import Langfuse

from app.core.config import settings

# Constructing the client registers it as the default, so `get_client()` and
# `@observe` anywhere in the app use these credentials.
langfuse = Langfuse(
    public_key=settings.LANGFUSE_PUBLIC_KEY,
    secret_key=settings.LANGFUSE_SECRET_KEY,
    base_url=settings.LANGFUSE_BASE_URL,
    tracing_enabled=bool(settings.LANGFUSE_PUBLIC_KEY and settings.LANGFUSE_SECRET_KEY),
)
