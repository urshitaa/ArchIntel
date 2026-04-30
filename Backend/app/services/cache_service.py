import hashlib


class CacheService:

    def generate_content_hash(
        self,
        content: str
    ):

        return hashlib.sha256(
            content.encode()
        ).hexdigest()