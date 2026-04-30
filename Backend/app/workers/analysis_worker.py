from app.services.streaming_service import (
    StreamingService
)


class AnalysisWorker:

    def __init__(self):

        self.streaming_service = (
            StreamingService()
        )

    async def process_repository(
        self,
        analysis_id: str,
    ):

        await self.streaming_service.send_step(
            analysis_id,
            "Downloading repository",
            10,
        )

        await self.streaming_service.send_log(
            analysis_id,
            "Repository tarball downloaded"
        )

        await self.streaming_service.send_step(
            analysis_id,
            "Building dependency graph",
            45,
        )

        await self.streaming_service.send_graph_update(
            analysis_id,
            {
                "nodes": [],
                "edges": [],
            }
        )

        await self.streaming_service.send_done(
            analysis_id
        )