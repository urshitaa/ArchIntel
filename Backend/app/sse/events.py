import json


def format_sse_event(
    event_type: str,
    data: dict
):

    return {
        "event": event_type,
        "data": json.dumps(data),
    }