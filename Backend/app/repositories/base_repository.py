from bson import ObjectId


class BaseRepository:

    def __init__(self, collection):
        self.collection = collection

    async def create(self, data: dict):

        result = await self.collection.insert_one(data)

        return str(result.inserted_id)

    async def get_by_id(self, document_id: str):

        return await self.collection.find_one(
            {
                "_id": ObjectId(document_id)
            }
        )

    async def update(
        self,
        document_id: str,
        data: dict
    ):

        await self.collection.update_one(
            {
                "_id": ObjectId(document_id)
            },
            {
                "$set": data
            }
        )

    async def delete(self, document_id: str):

        await self.collection.delete_one(
            {
                "_id": ObjectId(document_id)
            }
        )