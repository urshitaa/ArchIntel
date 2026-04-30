import sys
import json

from loguru import logger


logger.remove()

logger.add(
    sys.stdout,
    serialize=True,
    level="INFO",
)

app_logger = logger