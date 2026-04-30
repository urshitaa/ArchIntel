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