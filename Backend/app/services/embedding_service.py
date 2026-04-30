from openai import AsyncOpenAI

from app.core.config import settings


class EmbeddingService:

    def __init__(self):

        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY
        )

    async def generate_embedding(
        self,
        text: str
    ):

        response = await self.client.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )

        return response.data[0].embedding