import sys
import json
import io

from loguru import logger

logger.remove()

# Force UTF-8 encoding on sys.stdout for Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

logger.add(
    sys.stdout,
    serialize=True,
    level="INFO",
)

app_logger = logger