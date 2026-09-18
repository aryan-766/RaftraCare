from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "RaftraCare HospitalOS"
    port: int = 8000
    environment: str = "development"
    api_prefix: str = "/api/v1"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/carebridge"
    database_pool_size: int = 10
    database_max_overflow: int = 20

    # Supabase (optional external storage/auth)
    supabase_url: str = "https://mock.supabase.co"
    supabase_anon_key: str = "mock-anon-key"
    supabase_service_role_key: str = "mock-service-role-key"

    # JWT Authentication
    jwt_secret_key: str = "super_secret_jwt_key_carebridge_hospitalos_at_least_32_chars"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60  # Short-lived access token
    jwt_refresh_token_expire_days: int = 30    # Long-lived refresh token with rotation

    # Razorpay Payments & SaaS Billing
    razorpay_key_id: str = "rzp_test_placeholder"
    razorpay_key_secret: str = "rzp_test_placeholder_secret"
    razorpay_webhook_secret: str = "rzp_test_webhook_secret"

    # Rate Limiting
    rate_limit_requests: int = 1000
    rate_limit_window_seconds: int = 900

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @model_validator(mode="after")
    def validate_production_configuration(self):
        if self.is_production:
            if "default_secret" in self.jwt_secret_key.lower() or len(self.jwt_secret_key) < 32:
                raise ValueError("In production, JWT_SECRET_KEY must be a cryptographically secure random string with >= 32 characters.")
            if "localhost" in self.database_url and not self.debug:
                raise ValueError("In production, DATABASE_URL must point to a production-grade PostgreSQL instance.")
            if self.cors_origins == "*":
                raise ValueError("CORS_ORIGINS cannot be '*' in production with credentials enabled.")
        return self


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
