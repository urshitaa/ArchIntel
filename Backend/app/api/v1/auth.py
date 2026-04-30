from fastapi import APIRouter
from fastapi import Depends

from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
    UserResponse
)

from app.services.auth_service import AuthService

from app.repositories.users_repo import (
    UsersRepository
)

from app.api.deps.database import get_db
from app.api.deps.auth import get_current_user


router = APIRouter()


@router.post(
    "/signup",
    response_model=TokenResponse
)
async def signup(
    payload: SignupRequest,
    db=Depends(get_db)
):

    users_repo = UsersRepository(
        db["users"]
    )

    auth_service = AuthService(
        users_repo
    )

    return await auth_service.signup(
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name
    )


@router.post(
    "/login",
    response_model=TokenResponse
)
async def login(
    payload: LoginRequest,
    db=Depends(get_db)
):

    users_repo = UsersRepository(
        db["users"]
    )

    auth_service = AuthService(
        users_repo
    )

    return await auth_service.login(
        email=payload.email,
        password=payload.password
    )


@router.get(
    "/me",
    response_model=UserResponse
)
async def current_user(
    user=Depends(get_current_user)
):

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name")
    }