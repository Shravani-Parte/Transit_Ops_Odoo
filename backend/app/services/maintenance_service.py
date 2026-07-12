"""maintenance_service — open/close ↔ vehicle status sync.

Opening a maintenance record moves vehicle Available -> In Shop.
Closing a maintenance record returns vehicle In Shop -> Available,
unless it was Retired during the window.
Trying to open maintenance on an On Trip vehicle is rejected.
"""
from typing import Any


class MaintenanceService:
    async def open(self, payload: Any) -> Any:
        raise NotImplementedError

    async def close(self, log_id: str, payload: Any) -> Any:
        raise NotImplementedError
