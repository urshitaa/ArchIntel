from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.repository_analysis_service import RepositoryAnalysisService
from app.core.logging import app_logger

router = APIRouter()

class AnalyzeRequest(BaseModel):
    repo_url: str

@router.post("/analyze")
async def analyze_repository(request: AnalyzeRequest):
    app_logger.info(f"Received request to analyze {request.repo_url}")
    try:
        service = RepositoryAnalysisService()
        result = await service.analyze_repository(request.repo_url)
        app_logger.info(f" 🤣🤣🤣🤣🤣🤣Analysis result: {result}")
       # print(f"Analysis result: {result}")
        return result
    except Exception as e:
        app_logger.error(f"Error analyzing repository: {e}")
        raise HTTPException(status_code=500, detail=str(e))