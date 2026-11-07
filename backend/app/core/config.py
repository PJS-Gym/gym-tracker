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

    # Langfuse (LLM tracing, prompts, evals). Tracing is off when keys are missing.
    LANGFUSE_PUBLIC_KEY: str | None = None
    LANGFUSE_SECRET_KEY: str | None = None
    # EU region. US region is https://us.cloud.langfuse.com.
    LANGFUSE_BASE_URL: str = "https://cloud.langfuse.com"


settings = Settings()
