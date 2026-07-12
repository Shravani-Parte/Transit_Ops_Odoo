<<<<<<< HEAD
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
=======
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "TransitOps API"
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "transitops-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "transitops"
    MYSQL_PASSWORD: str = "transitops123"
    MYSQL_DATABASE: str = "transitops"

    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    class Config:
        env_file = ".env"
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8


settings = Settings()
