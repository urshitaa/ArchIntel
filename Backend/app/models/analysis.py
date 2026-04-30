from typing import Dict, List

from pydantic import Field

from app.models.base import MongoBaseModel


class AnalysisModel(MongoBaseModel):

    repository_id: str

    status: str = "queued"

    progress: int = 0

    current_stage: str = "initializing"

    summary: str | None = None

    detected_frameworks: List[str] = Field(
        default_factory=list
    )

    dependency_graph: Dict = Field(
        default_factory=dict
    )

    security_score: int | None = None

    total_files: int = 0

    processed_files: int = 0

    completed_at: str | None = None

    class Config:
        collection = "analyses"