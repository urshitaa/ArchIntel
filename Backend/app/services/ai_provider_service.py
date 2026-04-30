class AIProviderService:

    async def generate(
        self,
        prompt: str,
        model: str = "gpt-4o-mini",
        temperature: float = 0.2,
    ):

        raise NotImplementedError