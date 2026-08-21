from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Wraps DRF's default handler so every error response has a consistent
    shape the frontend can rely on:

        { "detail": "...", "errors": {...} | null, "code": "..." }
    """
    response = exception_handler(exc, context)
    if response is None:
        return None

    data = response.data
    if isinstance(data, dict) and "detail" in data and len(data) == 1:
        payload = {"detail": str(data["detail"]), "errors": None}
    else:
        payload = {"detail": "Validation failed.", "errors": data}

    payload["code"] = getattr(exc, "default_code", None) or response.status_code
    response.data = payload
    return response
