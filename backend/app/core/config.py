from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# `neon deploy` / `neon env pull` write DATABASE_URL here, next to neon.ts.
NEON_ENV_FILE = Path(__file__).resolve().parents[3] / ".env.local"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=NEON_ENV_FILE,
        env_ignore_empty=True,
        extra="ignore",
    )

    PROJECT_NAME: str = "Vercel + FastAPI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    # Pooled Neon connection string.
    DATABASE_URL: str | None = None

    # Clerk session tokens are verified with CLERK_JWT_KEY (the instance's PEM public key, no
    # network call) or, without it, with the keys published at CLERK_JWKS_URL
    # (https://<frontend-api>/.well-known/jwks.json). Clerk dashboard → Configure → API keys.
    CLERK_JWT_KEY: str | None = None
    CLERK_JWKS_URL: str | None = None
    # Frontend origins a token may come from (its `azp` claim), as JSON:
    # ["https://gym-tracker-one-topaz.vercel.app", "http://localhost:3000"]. Empty skips the check.
    CLERK_AUTHORIZED_PARTIES: list[str] = []
    # Reads a new user's email from the Clerk Backend API when the token does not carry it.
    CLERK_SECRET_KEY: str | None = None

    # Langfuse (LLM tracing, prompts, evals). Tracing is off when keys are missing.
    LANGFUSE_PUBLIC_KEY: str | None = None
    LANGFUSE_SECRET_KEY: str | None = None
    # EU region. US region is https://us.cloud.langfuse.com.
    LANGFUSE_BASE_URL: str = "https://cloud.langfuse.com"


settings = Settings()
