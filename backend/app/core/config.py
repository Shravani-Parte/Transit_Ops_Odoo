"""Settings loaded from env. Placeholder — no runtime binding."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Prefer runtime env var `DATABASE_URL` (set by docker-compose), fallback to default.
    # Pydantic BaseSettings reads env vars by field name; setting case sensitivity off makes it more robust.
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", env_prefix="", case_sensitive=False)

    database_url: str = "sqlite+aiosqlite:///./transitops.db"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24
    cors_origins: str = "http://localhost:5173,http://localhost:5174"
    redis_url: str = "redis://localhost:6379/0"
    license_expiry_remind_days: str = "30,14,7"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
