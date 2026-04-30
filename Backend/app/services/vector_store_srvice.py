import chromadb

from chromadb.config import Settings


class VectorStoreService:

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path="./chroma/repository_index",
            settings=Settings(
                anonymized_telemetry=False
            )
        )

        self.collection = (
            self.client.get_or_create_collection(
                name="repository_chunks"
            )
        )

    async def add_embedding(
        self,
        chunk_id: str,
        embedding: list[float],
        document: str,
        metadata: dict,
    ):

        self.collection.add(
            ids=[chunk_id],
            embeddings=[embedding],
            documents=[document],
            metadatas=[metadata],
        )

    async def semantic_search(
        self,
        embedding: list[float],
        repository_id: str,
        limit: int = 8,
    ):

        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=limit,
            where={
                "repository_id": repository_id
            },
        )

        return results