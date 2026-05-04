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


from pydantic import BaseModel
import httpx
from app.services.ai_orchestrator import AIOrchestrator

class FileSummaryRequest(BaseModel):
    file_path: str
    repo_url: str

@router.post("/file-summary")
async def get_file_summary(request: FileSummaryRequest):
    # Ensure the repo_url is clean
    url = request.repo_url
    if url.endswith(".git"):
        url = url[:-4]
    
    repo_parts = url.replace("https://github.com/", "").strip("/").split("/")
    if len(repo_parts) >= 2:
        owner, repo = repo_parts[0], repo_parts[1]
        raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{request.file_path}"
        
        async with httpx.AsyncClient() as client:
            resp = await client.get(raw_url)
            if resp.status_code == 200:
                file_content = resp.text
            else:
                file_content = f"Content could not be fetched (status {resp.status_code})."
    else:
        file_content = "Invalid repository URL."

    orchestrator = AIOrchestrator()
    summary = await orchestrator.generate_file_summary(file_content, request.file_path)
    return {"summary": summary}