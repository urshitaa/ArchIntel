from app.services.retrieval_service import (
    RetrievalService
)

from app.services.prompt_service import (
    build_chat_prompt
)

from app.utils.context_builder import (
    build_context
)


class RAGService:

    def __init__(
        self,
        ai_provider,
    ):

        self.ai_provider = ai_provider

        self.retrieval_service = (
            RetrievalService()
        )

    async def answer_question(
        self,
        repository_id: str,
        question: str,
    ):

        retrieved_chunks = (
            await self.retrieval_service
            .retrieve_context(
                repository_id=repository_id,
                query=question,
            )
        )

        context = build_context(
            retrieved_chunks
        )

        prompt = build_chat_prompt(
            question=question,
            context=context,
        )

        response = (
            await self.ai_provider.generate(
                prompt=prompt
            )
        )

        return {
            "answer": response,
            "sources": [
                chunk["metadata"]
                for chunk in retrieved_chunks
            ],
        }