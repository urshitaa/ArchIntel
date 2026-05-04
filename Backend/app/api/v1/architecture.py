from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from app.core.config import settings
from app.core.logging import app_logger
import json

router = APIRouter()

class ArchitectureRequest(BaseModel):
    files: list[dict]

@router.post("")
async def analyze_architecture(request: ArchitectureRequest):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
        
    # Format a prompt
    paths = [f"{file.get('path', '')} ({file.get('language', 'Unknown')})" for file in request.files[:150]]
    repo_structure = "\n".join(paths)
    
    prompt = f"""
    Analyze the following repository structure and provide a JSON response representing the architecture.
    Files:
    {repo_structure}
    
    Return EXACTLY this JSON structure:
    {{
        "summaries": {{ "path/to/file": "1-line summary describing its likely purpose." }},
        "narrative": [
            {{ "step": 1, "title": "Overview", "description": "High level architecture overview.", "components": ["Component1", "Component2"] }},
            {{ "step": 2, "title": "Frontend / Client", "description": "How the client is built.", "components": ["React", "State"] }},
            {{ "step": 3, "title": "Backend / Services", "description": "How the backend operates.", "components": ["API", "Service"] }}
        ],
        "complexity": {{
            "path/to/file": {{ "score": 85, "reason": "High cyclomatic complexity due to..." }}
        }}
    }}
    Provide summaries and complexity scores for the top 10 most important or complex files. Score is from 1 to 100.
    """
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "systemInstruction": {"parts": [{"text": "You are an expert software architect analyzing codebases. Return ONLY valid JSON."}]},
            "generationConfig": {"responseMimeType": "application/json"}
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=60.0)
            response.raise_for_status()
            
            result_data = response.json()
            content = result_data["candidates"][0]["content"]["parts"][0]["text"]
            
            data = json.loads(content)
            return data
            
    except Exception as e:
        app_logger.error(f"Error analyzing architecture: {e}")
        raise HTTPException(status_code=500, detail=str(e))
