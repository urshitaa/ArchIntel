from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.repositories import router as repositories_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.chat import router as chat_router
from app.api.v1.architecture import router as architecture_router


api_router = APIRouter()

api_router.include_router(
    health_router,
    tags=["Health"]
)

api_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"]
)

api_router.include_router(
    repositories_router,
    prefix="/repositories",
    tags=["Repositories"]
)

api_router.include_router(
    analysis_router,
    prefix="/analysis",
    tags=["Analysis"]
)

api_router.include_router(
    chat_router,
    prefix="/chat",
    tags=["Chat"]
)
 
api_router.include_router(
    architecture_router,
    prefix="/repositories/architecture",
    tags=["Architecture"]
)