def detect_frameworks(files: list[str]):

    frameworks = set()

    file_set = set(files)

    if "next.config.js" in file_set:
        frameworks.add("Next.js")

    if "nuxt.config.js" in file_set:
        frameworks.add("Nuxt")

    if "manage.py" in file_set:
        frameworks.add("Django")

    if "requirements.txt" in file_set:
        frameworks.add("Python")

    if "package.json" in file_set:
        frameworks.add("Node.js")

    if "Cargo.toml" in file_set:
        frameworks.add("Rust")

    return list(frameworks)