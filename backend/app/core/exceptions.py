class TransitOpsException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(TransitOpsException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, 404)


class ForbiddenError(TransitOpsException):
    def __init__(self, message: str = "Permission denied"):
        super().__init__(message, 403)


class ValidationError(TransitOpsException):
    def __init__(self, message: str):
        super().__init__(message, 422)
