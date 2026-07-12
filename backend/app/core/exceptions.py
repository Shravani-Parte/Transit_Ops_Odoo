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
