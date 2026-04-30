import time

from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import app_logger


class LoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):
        start_time = time.time()

        response = await call_next(request)

        duration = time.time() - start_time

        app_logger.info(
            f"{request.method} "
            f"{request.url.path} "
            f"{response.status_code} "
            f"{duration:.3f}s"
        )

        return response