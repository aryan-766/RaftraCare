from typing import Any, Optional
from fastapi.responses import JSONResponse
from fastapi import status


def success_response(
    data: Any,
    message: Optional[str] = None,
    status_code: int = status.HTTP_200_OK,
    meta: Optional[dict] = None,
) -> JSONResponse:
    payload = {
        "success": True,
        "message": message,
        "data": data,
    }
    if meta is not None:
        payload["meta"] = meta
    return JSONResponse(content=payload, status_code=status_code)


def created_response(data: Any, message: str = "Created successfully") -> JSONResponse:
    return success_response(data, message, status.HTTP_201_CREATED)


def error_response(
    message: str,
    code: str = "ERROR",
    status_code: int = status.HTTP_400_BAD_REQUEST,
    details: Optional[Any] = None,
) -> JSONResponse:
    payload: dict = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
        },
    }
    if details is not None:
        payload["error"]["details"] = details
    return JSONResponse(content=payload, status_code=status_code)
