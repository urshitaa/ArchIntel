import httpx
import asyncio
from app.core.config import settings

async def test():
    # Try the OpenAI compatible endpoint
    payload = {
        "model": "gemini-1.5-flash",
        "messages": [
            {"role": "user", "content": "Hello"}
        ]
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            headers={"Authorization": f"Bearer {settings.GEMINI_API_KEY}"},
            json=payload
        )
        print("OpenAI Flash:", res.status_code, res.text)

        payload["model"] = "gemini-1.5-pro"
        res2 = await client.post(
            "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            headers={"Authorization": f"Bearer {settings.GEMINI_API_KEY}"},
            json=payload
        )
        print("OpenAI Pro:", res2.status_code, res2.text)

if __name__ == "__main__":
    asyncio.run(test())
