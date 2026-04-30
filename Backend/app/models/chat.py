from typing import List

from pydantic import Field

from app.models.base import MongoBaseModel


class ChatMessageModel(MongoBaseModel):

    repository_id: str

    user_id: str

    role: str

    content: str

    sources: List[str] = Field(default_factory=list)

    class Config:
        collection = "chats"