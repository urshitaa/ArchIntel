import os

from app.utils.file_filters import (
    should_ignore_directory,
    should_ignore_file,
    is_large_file,
    is_binary_file,
)

from app.utils.language_detector import (
    detect_language
)


async def build_file_tree(root_path: str):

    files = []

    for root, dirs, filenames in os.walk(root_path):

        dirs[:] = [
            d for d in dirs
            if not should_ignore_directory(d)
        ]

        for filename in filenames:

            file_path = os.path.join(
                root,
                filename
            )

            relative_path = os.path.relpath(
                file_path,
                root_path
            )

            if should_ignore_file(file_path):
                continue

            if is_large_file(file_path):
                continue

            if is_binary_file(file_path):
                continue

            files.append(
                {
                    "path": relative_path,
                    "language": detect_language(
                        filename
                    ),
                    "size": os.path.getsize(file_path),
                }
            )

    return files