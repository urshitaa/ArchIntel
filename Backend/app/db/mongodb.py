from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


class MongoDatabase:
    client: AsyncIOMotorClient = None


db = MongoDatabase()


async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)

    print("Connected to MongoDB")


async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("MongoDB connection closed")


def get_database():
    return db.client[settings.MONGODB_DB]