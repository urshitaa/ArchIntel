from app.utils.token_counter import (
    estimate_tokens
)


MAX_CONTEXT_TOKENS = 6000


def build_context(
    retrieved_chunks: list,
):

    selected_chunks = []

    current_tokens = 0

    for chunk in retrieved_chunks:

        chunk_tokens = estimate_tokens(
            chunk["content"]
        )

        if (
            current_tokens + chunk_tokens
            > MAX_CONTEXT_TOKENS
        ):
            break

        selected_chunks.append(chunk)

        current_tokens += chunk_tokens

    return "\n\n".join(
        chunk["content"]
        for chunk in selected_chunks
    )