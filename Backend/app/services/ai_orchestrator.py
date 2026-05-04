import httpx
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AIOrchestrator:
    async def generate_file_summary(self, file_content: str, file_path: str) -> str:
        if not settings.OPENAI_API_KEY:
            logger.warning("OPENAI_API_KEY is not set. Falling back to dummy summary.")
            return f"Summary for {file_path} (API key missing)"

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are an expert programmer. Provide a concise summary of the following file. Explain what the file does and what its main components are."
                            },
                            {
                                "role": "user",
                                "content": f"File path: {file_path}\n\nContent:\n{file_content}"
                            }
                        ]
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    logger.error(f"OpenAI API error: {response.text}")
                    return f"Failed to generate summary: {response.text}"
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            return f"Error generating summary: {str(e)}"

# We can also add methods for Claude and DeepSeek here later.
