import asyncio
from collections import defaultdict


class SSEConnectionManager:

    def __init__(self):

        self.connections = defaultdict(list)

    async def connect(
        self,
        analysis_id: str
    ):

        queue = asyncio.Queue()

        self.connections[analysis_id].append(
            queue
        )

        return queue

    async def disconnect(
        self,
        analysis_id: str,
        queue
    ):

        if queue in self.connections[analysis_id]:

            self.connections[analysis_id].remove(
                queue
            )

        if not self.connections[analysis_id]:

            del self.connections[analysis_id]

    async def broadcast(
        self,
        analysis_id: str,
        event: dict
    ):

        queues = self.connections.get(
            analysis_id,
            []
        )

        for queue in queues:

            await queue.put(event)


sse_manager = SSEConnectionManager()