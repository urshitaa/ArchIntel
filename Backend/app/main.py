from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router

from app.core.config import settings
from app.core.logging import app_logger

from app.db.mongodb import (
    connect_to_mongo,
    close_mongo_connection
)

from app.middleware.logging import LoggingMiddleware
from app.middleware.request_context import (
    RequestContextMiddleware
)


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

    app_logger.info("Application startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

    app_logger.info("Application shutdown complete")


app.add_middleware(RequestContextMiddleware)

app.add_middleware(LoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_origins=[
            "https://arch-intel-one.vercel.app",
            "http://localhost:8081",
            "http://127.0.0.1:8081",
            "http://localhost:8080",
    "http://127.0.0.1:8080"
        ],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    api_router,
    prefix=settings.API_V1_PREFIX
)
