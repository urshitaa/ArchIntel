from typing import List

from pydantic import Field

from app.models.base import MongoBaseModel


class RepositoryModel(MongoBaseModel):

    user_id: str

    repo_url: str

    repo_name: str

    owner: str

    default_branch: str = "main"

    description: str | None = None

    detected_stack: List[str] = Field(default_factory=list)

    status: str = "queued"

    is_private: bool = False

    latest_analysis_id: str | None = None

    class Config:
        collection = "repositories"