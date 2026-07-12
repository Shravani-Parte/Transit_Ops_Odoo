"""export_service — primary business-rule enforcement layer.

DB triggers in database/triggers_views.sql provide a second, defense-in-depth
layer (per resolved diff #5) — not the primary one.
"""
from typing import Any


class ExportService:
    """Placeholder — wire up when the runtime is connected."""

    async def list(self, *args: Any, **kwargs: Any) -> list:
        return []

    async def get(self, entity_id: str) -> Any | None:
        return None

    async def create(self, data: Any) -> Any:
        raise NotImplementedError

    async def update(self, entity_id: str, data: Any) -> Any:
        raise NotImplementedError

    async def delete(self, entity_id: str) -> None:
        raise NotImplementedError
