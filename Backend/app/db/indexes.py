from app.db.mongodb import get_database

async def create_indexes():

    db = get_database()

    await db.users.create_index(
        "email",
        unique=True
    )

    await db.users.create_index(
        "github_id",
        sparse=True
    )

    await db.repositories.create_index(
        "user_id"
    )

    await db.repositories.create_index(
        "repo_url"
    )

    await db.analyses.create_index(
        "repository_id"
    )

    await db.files.create_index(
        [
            ("repository_id", 1),
            ("path", 1)
        ]
    )

    await db.embeddings.create_index(
        "repository_id"
    )

    await db.chats.create_index(
        [
            ("repository_id", 1),
            ("created_at", -1)
        ]
    )