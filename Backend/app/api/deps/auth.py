from bson import ObjectId

from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

from app.core.security import decode_token
from app.db.mongodb import get_database


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    token = credentials.credentials

    try:

        payload = decode_token(token)

        if payload.get("type") != "access":
            raise Exception()

        user_id = payload.get("sub")

        db = get_database()

        user = await db.users.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:
            raise Exception()

        return user

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )