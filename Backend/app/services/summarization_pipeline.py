import asyncio

from app.core.constants import (
    MAX_CONCURRENT_SUMMARIES
)


class SummarizationPipeline:

    def __init__(
        self,
        summarization_service
    ):

        self.summarization_service = (
            summarization_service
        )

        self.semaphore = asyncio.Semaphore(
            MAX_CONCURRENT_SUMMARIES
        )

    async def process_file(
        self,
        file_data
    ):

        async with self.semaphore:

            return await (
                self.summarization_service
                .summarize_file(
                    file_path=file_data["path"],
                    content=file_data["content"],
                )
            )

    async def process_files(
        self,
        files: list
    ):

        tasks = [
            self.process_file(file)
            for file in files
        ]

        return await asyncio.gather(
            *tasks
        )