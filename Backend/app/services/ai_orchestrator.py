import httpx
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AIOrchestrator:

    async def generate_file_summary(self, file_content: str, file_path: str) -> str:
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY is not set. Falling back to dummy summary.")
            return f"Summary for {file_path} (API key missing)"

        # 🔥 Limit content to avoid token overflow
        file_content = file_content[:8000]

        payload = {
            "model": "gemini-2.5-flash",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert programmer. Summarize code clearly and concisely."
                },
                {
                    "role": "user",
                    "content": f"File: {file_path}\n\nCode:\n{file_content}"
                }
            ],
            "temperature": 0.3,
            "max_tokens": 300
        }

        try:
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
                    return data["choices"][0]["message"]["content"].strip()

                logger.error(f"Gemini API error: {response.text}")
                return f"Failed: {response.text}"

        except httpx.TimeoutException:
            logger.error("Gemini request timed out")
            return "Error: Request timeout"

        except Exception as e:
            logger.error(f"Gemini error: {str(e)}")
            return f"Error: {str(e)}"