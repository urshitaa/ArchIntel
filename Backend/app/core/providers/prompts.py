CONCISE_SUMMARY_PROMPT = """
You are analyzing a repository file.

Generate a concise summary explaining:
- purpose
- responsibility
- major functionality

Keep it under 120 words.

FILE CONTENT:
{content}
"""


DETAILED_SUMMARY_PROMPT = """
Analyze this repository file.

Generate a detailed explanation covering:
- architecture role
- major classes/functions
- business logic
- dependencies
- important patterns

FILE CONTENT:
{content}
"""


TECHNICAL_SUMMARY_PROMPT = """
Analyze this code technically.

Focus on:
- algorithms
- architecture
- design patterns
- async behavior
- performance considerations
- security concerns

FILE CONTENT:
{content}
"""