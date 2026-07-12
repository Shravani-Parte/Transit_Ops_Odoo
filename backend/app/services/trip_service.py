"""trip_service — trip lifecycle + validation.

Rules enforced here (primary layer; DB triggers mirror as defense-in-depth):
  - Cargo weight <= vehicle.max_load_capacity
  - Vehicle status must be Available (never In Shop, Retired, On Trip)
  - Driver status must be Available and license not expired and not Suspended
  - Dispatch atomically flips vehicle.status -> On Trip and driver.status -> On Trip
  - Complete/Cancel atomically returns both to Available
  - Every state change writes a trip_status_history entry
  - Re-validate at dispatch time (values may have changed since Draft)
"""
from typing import Any


class TripService:
    async def create_draft(self, payload: Any) -> Any:
        raise NotImplementedError

    async def dispatch(self, trip_id: str) -> Any:
        raise NotImplementedError

    async def complete(self, trip_id: str, payload: Any) -> Any:
        raise NotImplementedError

    async def cancel(self, trip_id: str, reason: str | None) -> Any:
        raise NotImplementedError
