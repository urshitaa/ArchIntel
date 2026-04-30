from app.repositories.base_repository import (
    BaseRepository
)


class RepositoriesRepository(BaseRepository):

    async def get_by_user(
        self,
        user_id: str
    ):

        cursor = self.collection.find(
            {
                "user_id": user_id
            }
        )

        return await cursor.to_list(length=100)

    async def get_by_repo_url(
        self,
        repo_url: str
    ):

        return await self.collection.find_one(
            {
                "repo_url": repo_url
            }
        )