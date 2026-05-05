from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import settings
from app.core.logging import app_logger
import json
import os

router = APIRouter()

class ArchitectureRequest(BaseModel):
    files: list[dict]

@router.post("")
async def analyze_architecture(request: ArchitectureRequest):
    try:
        files = request.files
        
        narrative = []
        complexity = {}
        summaries = {}
        
        # Group files by top level directory to form components
        components_map = {}
        for file in files:
            path = file.get("path", "")
            size = file.get("size", 0)
            
            # Simple complexity heuristic based on size
            score = min(100, max(10, int((size / 1024) * 2)))  # rough KB * 2
            
            # Special case for known complex files
            if path.endswith((".py", ".tsx", ".ts", ".js", ".go", ".rs", ".cpp", ".java", ".c")):
                score = min(100, score + 30)
            if "api" in path or "core" in path or "store" in path:
                score = min(100, score + 20)
                
            reason = f"Complexity computed based on file size ({size} bytes) and path location."
            if score > 80:
                reason = f"High complexity due to significant logic density in {path}."
            elif score > 60:
                reason = f"Moderate complexity in {path}."
                
            complexity[path] = {
                "score": score,
                "reason": reason
            }
            
            filename = os.path.basename(path)
            summaries[path] = f"Handles {filename} operations and logic."
            
            parts = path.split("/")
            if len(parts) > 1:
                top_dir = parts[0]
            else:
                top_dir = "Root"
                
            if top_dir not in components_map:
                components_map[top_dir] = []
            if len(components_map[top_dir]) < 5:
                components_map[top_dir].append(filename)

        # Build narrative
        step = 1
        for comp, items in components_map.items():
            narrative.append({
                "step": step,
                "title": f"Component: {comp}",
                "description": f"The {comp} module forms a critical part of the architecture, containing key elements such as {', '.join(items)}.",
                "components": [comp] + items[:3]
            })
            step += 1
            
        if not narrative:
            narrative.append({
                "step": 1,
                "title": "Project Foundation",
                "description": "The foundation of the project.",
                "components": ["Core"]
            })
            
        return {
            "narrative": narrative,
            "complexity": complexity,
            "summaries": summaries
        }

    except Exception as e:
        app_logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))