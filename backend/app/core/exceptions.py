from fastapi import HTTPException, status


class RaftraCareException(Exception):
    """Base exception for RaftraCare HospitalOS"""
    def __init__(self, message: str, code: str = "INTERNAL_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class NotFoundError(RaftraCareException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, "NOT_FOUND")


class UnauthorizedError(RaftraCareException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, "UNAUTHORIZED")


class ForbiddenError(RaftraCareException):
    def __init__(self, message: str = "Forbidden: Insufficient permissions"):
        super().__init__(message, "FORBIDDEN")


class ConflictError(RaftraCareException):
    def __init__(self, message: str = "Resource conflict"):
        super().__init__(message, "CONFLICT")


class BadRequestError(RaftraCareException):
    def __init__(self, message: str = "Bad request"):
        super().__init__(message, "BAD_REQUEST")


class ValidationError(RaftraCareException):
    def __init__(self, message: str = "Validation failed", details: list = None):
        self.details = details or []
        super().__init__(message, "VALIDATION_ERROR")


# HTTP status code mapping
EXCEPTION_STATUS_MAP = {
    "NOT_FOUND": status.HTTP_404_NOT_FOUND,
    "UNAUTHORIZED": status.HTTP_401_UNAUTHORIZED,
    "FORBIDDEN": status.HTTP_403_FORBIDDEN,
    "CONFLICT": status.HTTP_409_CONFLICT,
    "BAD_REQUEST": status.HTTP_400_BAD_REQUEST,
    "VALIDATION_ERROR": status.HTTP_422_UNPROCESSABLE_ENTITY,
    "INTERNAL_ERROR": status.HTTP_500_INTERNAL_SERVER_ERROR,
}
