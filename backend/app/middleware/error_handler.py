"""Global exception -> JSON response mapping."""
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.core.exceptions import DomainError, UniqueViolation, InvalidStateTransition, DispatchViolation, PermissionDenied


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(UniqueViolation)
    async def _unique(_req: Request, exc: UniqueViolation):
        return JSONResponse({"error": "unique_violation", "detail": str(exc)}, status_code=409)

    @app.exception_handler(InvalidStateTransition)
    async def _state(_req: Request, exc: InvalidStateTransition):
        return JSONResponse({"error": "invalid_state_transition", "detail": str(exc)}, status_code=409)

    @app.exception_handler(DispatchViolation)
    async def _dispatch(_req: Request, exc: DispatchViolation):
        return JSONResponse({"error": "dispatch_violation", "detail": str(exc)}, status_code=422)

    @app.exception_handler(PermissionDenied)
    async def _rbac(_req: Request, exc: PermissionDenied):
        return JSONResponse({"error": "permission_denied", "detail": str(exc)}, status_code=403)

    @app.exception_handler(DomainError)
    async def _domain(_req: Request, exc: DomainError):
        return JSONResponse({"error": "domain_error", "detail": str(exc)}, status_code=400)
