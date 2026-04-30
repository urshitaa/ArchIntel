import os

from app.services.github_service import (
    GitHubService
)

from app.utils.tree_builder import (
    build_file_tree
)

from app.utils.framework_detector import (
    detect_frameworks
)

from app.utils.dependency_parser import (
    parse_package_json
)


class RepositoryAnalysisService:

    def __init__(self):

        self.github_service = GitHubService()

    async def analyze_repository(
        self,
        repo_url: str
    ):

        metadata = (
            await self.github_service
            .fetch_repository_metadata(repo_url)
        )

        owner = metadata["owner"]["login"]

        repo = metadata["name"]

        default_branch = (
            metadata["default_branch"]
        )

        tarball_path = (
            await self.github_service
            .download_repository_tarball(
                owner=owner,
                repo=repo,
                branch=default_branch,
            )
        )

        extracted_path = (
            await self.github_service
            .extract_tarball(tarball_path)
        )

        extracted_dirs = os.listdir(
            extracted_path
        )

        repo_root = os.path.join(
            extracted_path,
            extracted_dirs[0]
        )

        file_tree = await build_file_tree(
            repo_root
        )

        file_paths = [
            file["path"]
            for file in file_tree
        ]

        frameworks = detect_frameworks(
            file_paths
        )

        dependencies = {}

        package_json_path = os.path.join(
            repo_root,
            "package.json"
        )

        if os.path.exists(package_json_path):

            dependencies = parse_package_json(
                package_json_path
            )

        return {
            "repository": {
                "name": repo,
                "owner": owner,
                "description": metadata.get(
                    "description"
                ),
                "stars": metadata.get(
                    "stargazers_count"
                ),
                "default_branch": default_branch,
            },
            "frameworks": frameworks,
            "dependencies": dependencies,
            "files": file_tree,
        }