from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Server
    port: int = 8000
    environment: str = "development"
    api_prefix: str = "/api/v1"
    cors_origins: str = "http://localhost:3000"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/carebridge"
    database_pool_size: int = 10
    database_max_overflow: int = 20

    # Supabase
    supabase_url: str = "https://mock.supabase.co"
    supabase_anon_key: str = "mock-anon-key"
    supabase_service_role_key: str = "mock-service-role-key"

    # JWT
    jwt_secret_key: str = "carebridge_default_secret_change_in_production_32chars"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 10080  # 7 days
    jwt_refresh_token_expire_days: int = 30

    # Razorpay
    razorpay_key_id: str = "rzp_test_placeholder"
    razorpay_key_secret: str = "rzp_test_placeholder_secret"
    razorpay_webhook_secret: str = "rzp_test_webhook_secret"

    # Rate Limiting
    rate_limit_requests: int = 1000
    rate_limit_window_seconds: int = 900

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
