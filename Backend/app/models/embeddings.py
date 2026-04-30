from typing import Dict, List

from pydantic import Field

from app.models.base import MongoBaseModel


class EmbeddingModel(MongoBaseModel):

    repository_id: str

    analysis_id: str

    file_id: str

    chunk_index: int

    content: str

    embedding: List[float]

    metadata: Dict = Field(default_factory=dict)

    class Config:
        collection = "embeddings"