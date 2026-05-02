import os
import asyncio

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
    parse_package_json,
    parse_requirements_txt
)

IGNORE_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    "__pycache__",
    "venv",
}


class RepositoryAnalysisService:

    def __init__(self):

        self.github_service = GitHubService()

    async def analyze_repository(
        self,
        repo_url: str
    ):

        # ====================================
        # FETCH REPOSITORY METADATA
        # ====================================

        metadata = (
            await self.github_service
            .fetch_repository_metadata(repo_url)
        )

        owner = metadata["owner"]["login"]

        repo = metadata["name"]

        default_branch = (
            metadata["default_branch"]
        )

        # ====================================
        # PARALLEL GITHUB REQUESTS
        # ====================================

        languages_task = (
            self.github_service.fetch_languages(
                owner,
                repo
            )
        )

        contributors_task = (
            self.github_service.fetch_contributors(
                owner,
                repo
            )
        )

        commits_task = (
            self.github_service.fetch_recent_commits(
                owner,
                repo
            )
        )

        branches_task = (
            self.github_service.fetch_branches(
                owner,
                repo
            )
        )

        (
            languages,
            contributors,
            commits,
            branches
        ) = await asyncio.gather(
            languages_task,
            contributors_task,
            commits_task,
            branches_task,
        )

        # ====================================
        # DOWNLOAD REPOSITORY
        # ====================================

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

        # ====================================
        # BUILD FILE TREE
        # ====================================

        file_tree = await build_file_tree(
            repo_root,
            ignore_dirs=IGNORE_DIRS
        )

        file_paths = [
            file["path"]
            for file in file_tree
        ]

        # ====================================
        # FRAMEWORK DETECTION
        # ====================================

        frameworks = detect_frameworks(
            file_paths
        )

        # ====================================
        # DEPENDENCY DETECTION
        # ====================================

        dependencies = {}

        package_json_path = os.path.join(
            repo_root,
            "package.json"
        )
        
        requirements_txt_path = os.path.join(
            repo_root,
            "requirements.txt"
        )

        if os.path.exists(package_json_path):
            dependencies.update(parse_package_json(
                package_json_path
            ))
            
        if os.path.exists(requirements_txt_path):
            dependencies.update(parse_requirements_txt(
                requirements_txt_path
            ))

        # ====================================
        # TECH STACK
        # ====================================

        tech_stack = {
            "languages": list(
                languages.keys()
            ),
            "frameworks": frameworks,
            "libraries": list(
                dependencies.keys()
            ),
        }

        # ====================================
        # PROJECT STATISTICS
        # ====================================

        total_files = len(file_tree)

        total_loc = sum(
            file.get("size", 0)
            for file in file_tree
        )

        # ====================================
        # RESPONSE
        # ====================================

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
                "forks": metadata.get(
                    "forks_count"
                ),
                "watchers": metadata.get(
                    "watchers_count"
                ),
                "open_issues": metadata.get(
                    "open_issues_count"
                ),
                "default_branch": default_branch,
                "created_at": metadata.get(
                    "created_at"
                ),
                "updated_at": metadata.get(
                    "updated_at"
                ),
                "topics": metadata.get(
                    "topics",
                    []
                ),
                "license": (
                    metadata.get("license", {})
                    .get("name")
                ),
            },

            "stats": {
                "files": total_files,
                "loc": total_loc,
                "contributors": len(contributors),
                "branches": len(branches),
                "last_commit": (
                    commits[0]["date"]
                    if commits else None
                )
            },

            "languages": languages,

            "frameworks": frameworks,

            "dependencies": dependencies,

            "tech_stack": tech_stack,

            "contributors": contributors[:10],

            "commits": commits[:10],

            "branches": branches,

            "files": file_tree,
        }