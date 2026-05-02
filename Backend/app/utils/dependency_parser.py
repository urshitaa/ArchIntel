import json


def parse_package_json(file_path: str):

    try:

        with open(file_path, "r") as f:

            data = json.load(f)

        dependencies = (
            data.get("dependencies", {})
        )

        dev_dependencies = (
            data.get("devDependencies", {})
        )

        return {
            **dependencies,
            **dev_dependencies,
        }

    except Exception:
        return {}


def parse_requirements_txt(file_path: str):
    import re
    try:
        dependencies = {}
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                # Split on version specifiers
                match = re.split(r'==|>=|<=|~=|<|>', line)
                if match:
                    pkg = match[0].strip()
                    version = match[1].strip() if len(match) > 1 else "latest"
                    if pkg:
                        dependencies[pkg] = version
        return dependencies
    except Exception:
        return {}