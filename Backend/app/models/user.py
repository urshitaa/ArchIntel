from pydantic import EmailStr

from app.models.base import MongoBaseModel


class UserModel(MongoBaseModel):

    email: EmailStr

    hashed_password: str

    full_name: str | None = None

    github_id: str | None = None

    avatar_url: str | None = None

    is_active: bool = True