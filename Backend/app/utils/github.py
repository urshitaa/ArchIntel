import re


GITHUB_REPO_REGEX = re.compile(
    r"^https://github\.com/"
    r"(?P<owner>[A-Za-z0-9_.-]+)/"
    r"(?P<repo>[A-Za-z0-9_.-]+)"
    r"(?:\.git)?/?$"
)


def validate_github_url(url: str):

    match = GITHUB_REPO_REGEX.match(url)

    if not match:
        return None

    return {
        "owner": match.group("owner"),
        "repo": match.group("repo"),
    }