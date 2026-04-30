from app.repositories.base_repository import (
    BaseRepository
)


class UsersRepository(BaseRepository):

    async def get_by_email(
        self,
        email: str
    ):

        return await self.collection.find_one(
            {
                "email": email
            }
        )