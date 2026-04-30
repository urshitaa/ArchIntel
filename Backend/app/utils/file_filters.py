import os

from app.core.constants import (
    IGNORED_DIRECTORIES,
    IGNORED_EXTENSIONS,
    MAX_FILE_SIZE_MB,
)


def should_ignore_directory(directory: str):

    return directory in IGNORED_DIRECTORIES


def should_ignore_file(file_path: str):

    extension = os.path.splitext(file_path)[1]

    return extension.lower() in IGNORED_EXTENSIONS


def is_large_file(file_path: str):

    size_mb = os.path.getsize(file_path) / (
        1024 * 1024
    )

    return size_mb > MAX_FILE_SIZE_MB


def is_binary_file(file_path: str):

    try:

        with open(file_path, "rb") as f:

            chunk = f.read(1024)

            return b"\0" in chunk

    except Exception:
        return True