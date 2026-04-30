from app.core.prompts import (
    CONCISE_SUMMARY_PROMPT,
    DETAILED_SUMMARY_PROMPT,
    TECHNICAL_SUMMARY_PROMPT,
)

from app.services.chunking_service import (
    ChunkingService
)
   
from app.utils.code_filters import (
    should_ignore_file,
    is_generated_file,
    is_minified,
)

from app.utils.token_counter import (
    estimate_tokens
)


class SummarizationService:

    def __init__(
        self,
        ai_provider,
    ):

        self.ai_provider = ai_provider

        self.chunking_service = (
            ChunkingService()
        )

    async def summarize_file(
        self,
        file_path: str,
        content: str,
    ):

        if should_ignore_file(file_path):
            return None

        if is_generated_file(content):
            return None

        if is_minified(content):
            return None

        token_count = estimate_tokens(content)

        if token_count > 12000:

            chunks = (
                await self.chunking_service
                .chunk_content(content)
            )

            reduced_content = "\n\n".join(
                chunks[:3]
            )

        else:

            reduced_content = content

        concise_prompt = (
            CONCISE_SUMMARY_PROMPT.format(
                content=reduced_content
            )
        )

        detailed_prompt = (
            DETAILED_SUMMARY_PROMPT.format(
                content=reduced_content
            )
        )

        technical_prompt = (
            TECHNICAL_SUMMARY_PROMPT.format(
                content=reduced_content
            )
        )

        concise_summary = (
            await self.ai_provider.generate(
                concise_prompt
            )
        )

        detailed_summary = (
            await self.ai_provider.generate(
                detailed_prompt
            )
        )

        technical_summary = (
            await self.ai_provider.generate(
                technical_prompt
            )
        )

        return {
            "concise_summary": concise_summary,
            "detailed_summary": detailed_summary,
            "technical_summary": technical_summary,
        }