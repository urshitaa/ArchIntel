from fastapi import APIRouter
from fastapi import Depends

from sse_starlette.sse import (
    EventSourceResponse
)

from app.services.rag_service import (
    RAGService
)


router = APIRouter()


@router.post("/stream")
async def stream_chat():

    async def event_generator():

        yield {
            "event": "step",
            "data": "Retrieving repository context",
        }

        yield {
            "event": "step",
            "data": "Generating response",
        }

        yield {
            "event": "done",
            "data": "Completed",
        }

    return EventSourceResponse(
        event_generator()
    )