import asyncio

from fastapi import APIRouter
from fastapi import Request

from sse_starlette.sse import EventSourceResponse

from app.sse.manager import sse_manager


router = APIRouter()


@router.get(
    "/stream/{analysis_id}"
)
async def stream_analysis(
    analysis_id: str,
    request: Request,
):

    queue = await sse_manager.connect(
        analysis_id
    )

    async def event_generator():

        try:

            while True:

                if await request.is_disconnected():
                    break

                try:

                    event = await asyncio.wait_for(
                        queue.get(),
                        timeout=15
                    )

                    yield event

                except asyncio.TimeoutError:

                    yield {
                        "event": "ping",
                        "data": "keepalive",
                    }

        finally:

            await sse_manager.disconnect(
                analysis_id,
                queue
            )

    return EventSourceResponse(
        event_generator()
    )