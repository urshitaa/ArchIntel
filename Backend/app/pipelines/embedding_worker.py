import asyncio

from app.services.embedding_service import (
    EmbeddingService
)

# from app.services.vector_store_service import (
#     VectorStoreService
# )


class EmbeddingPipeline:

    def __init__(self):

        self.embedding_service = (
            EmbeddingService()
        )

        self.vector_store = (
            VectorStoreService()
        )

    async def process_chunk(
        self,
        repository_id: str,
        file_path: str,
        chunk_index: int,
        content: str,
    ):

        embedding = (
            await self.embedding_service
            .generate_embedding(content)
        )

        chunk_id = (
            f"{repository_id}:"
            f"{file_path}:"
            f"{chunk_index}"
        )

        await self.vector_store.add_embedding(
            chunk_id=chunk_id,
            embedding=embedding,
            document=content,
            metadata={
                "repository_id": repository_id,
                "file_path": file_path,
                "chunk_index": chunk_index,
            },
        )

    async def process_chunks(
        self,
        repository_id: str,
        chunks: list,
    ):

        tasks = [
            self.process_chunk(
                repository_id=repository_id,
                file_path=chunk["file_path"],
                chunk_index=chunk["chunk_index"],
                content=chunk["content"],
            )
            for chunk in chunks
        ]

        await asyncio.gather(*tasks)