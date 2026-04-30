from app.sse.manager import sse_manager
from app.sse.events import format_sse_event


class StreamingService:

    async def send_step(
        self,
        analysis_id: str,
        step: str,
        progress: int,
    ):

        await sse_manager.broadcast(
            analysis_id,
            format_sse_event(
                "step",
                {
                    "step": step,
                    "progress": progress,
                }
            )
        )

    async def send_graph_update(
        self,
        analysis_id: str,
        graph_data: dict,
    ):

        await sse_manager.broadcast(
            analysis_id,
            format_sse_event(
                "graph",
                graph_data
            )
        )

    async def send_log(
        self,
        analysis_id: str,
        message: str,
    ):

        await sse_manager.broadcast(
            analysis_id,
            format_sse_event(
                "log",
                {
                    "message": message
                }
            )
        )

    async def send_done(
        self,
        analysis_id: str,
    ):

        await sse_manager.broadcast(
            analysis_id,
            format_sse_event(
                "done",
                {
                    "status": "completed"
                }
            )
        )