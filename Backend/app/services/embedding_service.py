import hashlib
import struct
from app.core.config import settings


import httpx

class EmbeddingService:

    def __init__(self):
        pass

    async def generate_embedding(self, text: str):
        # Step 1: Get semantic summary from Gemini
        payload = {
            "model": "gemini-1.5-pro",
            "messages": [
                {"role": "system", "content": "Summarize the semantic meaning of this text briefly."},
                {"role": "user", "content": text}
            ],
            "temperature": 0
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.GEMINI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                summary = data["choices"][0]["message"]["content"].strip()
            else:
                summary = "Failed to summarize text"

        # Step 2: Convert to pseudo-vector
        return self._text_to_vector(summary)

    def _text_to_vector(self, text: str, dim: int = 384):
        hash_bytes = hashlib.sha256(text.encode()).digest()

        vector = []
        for i in range(dim):
            chunk = hash_bytes[i % len(hash_bytes): (i % len(hash_bytes)) + 4]
            if len(chunk) < 4:
                chunk = chunk.ljust(4, b'\0')

            num = struct.unpack("f", chunk)[0]
            vector.append(num)

        return vector