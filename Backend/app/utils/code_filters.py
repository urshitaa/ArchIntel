import os

from app.core.constants import (
    IGNORED_PATTERNS,
    GENERATED_FILE_HINTS,
)


def is_minified(content: str):

    if len(content) < 500:
        return False

    average_line_length = (
        len(content) / max(content.count("\n"), 1)
    )

    return average_line_length > 300


def is_generated_file(content: str):

    lowered = content.lower()

    return any(
        hint in lowered
        for hint in GENERATED_FILE_HINTS
    )


def should_ignore_file(file_path: str):

    filename = os.path.basename(file_path)

    return any(
        pattern in filename
        for pattern in IGNORED_PATTERNS
    )