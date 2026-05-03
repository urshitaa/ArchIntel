import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.abspath("backend"))

from app.services.repository_analysis_service import RepositoryAnalysisService

async def main():
    service = RepositoryAnalysisService()
    try:
        print("Analyzing...")
        result = await service.analyze_repository("https://github.com/abhi17bgp/Codeforces-Lookup")
        print("Success!")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
