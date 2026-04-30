import os
import tarfile
import tempfile

import httpx

from app.core.config import settings
from app.utils.github import validate_github_url


class GitHubService:

    BASE_URL = "https://api.github.com"

    def __init__(self):

        self.headers = {
            "Accept": "application/vnd.github+json",
        }

        if settings.GITHUB_TOKEN:
            self.headers["Authorization"] = (
                f"Bearer {settings.GITHUB_TOKEN}"
            )

    async def fetch_repository_metadata(
        self,
        repo_url: str
    ):

        parsed = validate_github_url(repo_url)

        if not parsed:
            raise ValueError("Invalid GitHub repository URL")

        owner = parsed["owner"]
        repo = parsed["repo"]

        endpoint = (
            f"{self.BASE_URL}/repos/"
            f"{owner}/{repo}"
        )

        async with httpx.AsyncClient(
            timeout=30
        ) as client:

            response = await client.get(
                endpoint,
                headers=self.headers
            )

        if response.status_code != 200:
            raise Exception(
                "Unable to fetch repository metadata"
            )

        return response.json()

    async def download_repository_tarball(
        self,
        owner: str,
        repo: str,
        branch: str
    ):

        tarball_url = (
            f"{self.BASE_URL}/repos/"
            f"{owner}/{repo}/tarball/{branch}"
        )

        temp_dir = tempfile.mkdtemp()

        tarball_path = os.path.join(
            temp_dir,
            "repository.tar.gz"
        )

        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=120
        ) as client:

            async with client.stream(
                "GET",
                tarball_url,
                headers=self.headers
            ) as response:

                response.raise_for_status()

                with open(tarball_path, "wb") as f:

                    async for chunk in response.aiter_bytes():
                        f.write(chunk)

        return tarball_path

    async def extract_tarball(
        self,
        tarball_path: str
    ):

        extract_path = tempfile.mkdtemp()

        with tarfile.open(
            tarball_path,
            "r:gz"
        ) as tar:

            tar.extractall(path=extract_path)

        return extract_path