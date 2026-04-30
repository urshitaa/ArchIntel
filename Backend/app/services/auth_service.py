from bson import ObjectId
from fastapi import HTTPException, status

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token
)


class AuthService:

    def __init__(self, users_repo):
        self.users_repo = users_repo

    async def signup(
        self,
        email: str,
        password: str,
        full_name: str | None = None
    ):

        existing_user = await self.users_repo.get_by_email(
            email
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_password = hash_password(password)

        user_data = {
            "email": email,
            "hashed_password": hashed_password,
            "full_name": full_name,
            "is_active": True,
        }

        user_id = await self.users_repo.create(
            user_data
        )

        access_token = create_access_token(
            {
                "sub": user_id
            }
        )

        refresh_token = create_refresh_token(
            {
                "sub": user_id
            }
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

    async def login(
        self,
        email: str,
        password: str
    ):

        user = await self.users_repo.get_by_email(
            email
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        valid_password = verify_password(
            password,
            user["hashed_password"]
        )

        if not valid_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        user_id = str(user["_id"])

        access_token = create_access_token(
            {
                "sub": user_id
            }
        )

        refresh_token = create_refresh_token(
            {
                "sub": user_id
            }
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }