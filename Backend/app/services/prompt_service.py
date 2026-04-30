SYSTEM_PROMPT = """
You are an expert software architect.

You are answering questions about a GitHub repository.

Rules:
- Only answer using repository context
- If information is missing, say so
- Be technically precise
- Reference relevant files when possible
- Avoid hallucinating implementation details
"""


def build_chat_prompt(
    question: str,
    context: str,
):

    return f"""
REPOSITORY CONTEXT:

{context}

USER QUESTION:

{question}

Answer clearly and technically.
"""