from pydantic import BaseModel


class EmbeddingChunk(BaseModel):

    repository_id: str

    file_path: str

    chunk_index: int

    content: str

    summary: str | None = None