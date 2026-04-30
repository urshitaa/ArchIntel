from app.services.embedding_service import (
    EmbeddingService
)

# from app.services.vector_store_service import (
#     VectorStoreService
# )


class RetrievalService:

    def __init__(self):

        self.embedding_service = (
            EmbeddingService()
        )

        self.vector_store = (
            VectorStoreService()
        )

    async def retrieve_context(
        self,
        repository_id: str,
        query: str,
    ):

        query_embedding = (
            await self.embedding_service
            .generate_embedding(query)
        )

        results = (
            await self.vector_store
            .semantic_search(
                embedding=query_embedding,
                repository_id=repository_id,
            )
        )

        documents = results["documents"][0]

        metadata = results["metadatas"][0]

        return [
            {
                "content": doc,
                "metadata": meta,
            }
            for doc, meta in zip(
                documents,
                metadata
            )
        ]