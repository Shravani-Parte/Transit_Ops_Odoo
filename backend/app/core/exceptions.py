<<<<<<< HEAD
"""Domain-level exceptions."""


class DomainError(Exception):
    """Base for expected business-rule violations."""


class UniqueViolation(DomainError):
    """Duplicate registration_number / license_number."""


class InvalidStateTransition(DomainError):
    """Illegal status transition on Vehicle / Driver / Trip."""


class DispatchViolation(DomainError):
    """Cargo > capacity, expired license, suspended driver, retired vehicle, etc."""


class PermissionDenied(DomainError):
    """RBAC layer rejection."""
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
