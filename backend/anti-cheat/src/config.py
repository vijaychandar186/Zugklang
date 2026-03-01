from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.base", ".env"),
        extra="ignore",
    )

    log_level:  str  = "INFO"
    data_dir:   Path = Path("data")
    model_dir:  Path = Path("src/model")
    use_eval:   int  = 0
    tc_list:    list[int] = [2, 6]
    days_list:  list[int] = [180]

    database_url: str = "postgresql://postgres:postgres@localhost:5432/kaladin"
    ws_monitor_token: str | None = None
    ws_monitor_retention_minutes: int = 120
    ws_monitor_persist: int = 1

    @field_validator("log_level", mode="before")
    @classmethod
    def _upper(cls, v: str) -> str:
        return v.upper()

    @property
    def model_configs(self) -> list[tuple[int, int, int]]:
        """All (use_eval, tc, days) combinations to load at startup."""
        return [
            (self.use_eval, tc, days)
            for tc in self.tc_list
            for days in self.days_list
        ]


settings = Settings()
