EXTENSION_LANGUAGE_MAP = {
    ".py": "Python",
    ".js": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".jsx": "JavaScript",
    ".go": "Go",
    ".rs": "Rust",
    ".java": "Java",
    ".cpp": "C++",
    ".c": "C",
}


def detect_language(file_name: str):

    for ext, language in (
        EXTENSION_LANGUAGE_MAP.items()
    ):

        if file_name.endswith(ext):
            return language

    return "Unknown"