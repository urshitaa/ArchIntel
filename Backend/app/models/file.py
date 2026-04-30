from pydantic import Field

from app.models.base import MongoBaseModel


class FileModel(MongoBaseModel):

    repository_id: str

    analysis_id: str

    path: str

    language: str | None = None

    extension: str | None = None

    size: int = 0

    sha: str | None = None

    summary: str | None = None

    chunk_count: int = 0

    indexed: bool = False

    class Config:
        collection = "files"