from pydantic import BaseModel
from typing import Any


class SSEEvent(BaseModel):

    event: str

    data: Any