# from functools import lru_cache
# from typing import List
# from pydantic import Field
# from pydantic_settings import BaseSettings, SettingsConfigDict



# class Settings(BaseSettings):
#     CORS_ORIGINS: str = ""

#     class Config:
#         env_file = ".env"
#         case_sensitive = True

#     @property
#     def cors_origins_list(self) -> List[str]:
#         if not self.CORS_ORIGINS:
#             return []

#         return [
#             origin.strip()
#             for origin in self.CORS_ORIGINS.split(",")
#             if origin.strip()
#         ]


# @lru_cache
# def get_settings():
#     return Settings()


# settings = get_settings()

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "ArchIntel API"
    APP_ENV: str = "development"
    DEBUG: bool = True

    API_V1_PREFIX: str = "/api/v1"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    MONGODB_URL: str
    MONGODB_DB: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    OPENAI_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    GITHUB_TOKEN: str | None = None

    CORS_ORIGINS: str = "http://localhost:8080"
     
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",  # or "allow"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return []

        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
        ]


@lru_cache
def get_settings():
    return Settings()





settings = get_settings()