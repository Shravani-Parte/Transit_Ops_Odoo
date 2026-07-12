"""App-layer validators (mirrored by DB triggers as defense-in-depth).

- cargo_weight_within_capacity
- license_not_expired
- vehicle_dispatchable  (status in {Available})
- driver_dispatchable   (status in {Available}, not Suspended, license valid)
"""
from datetime import date
from decimal import Decimal


def cargo_within_capacity(cargo: Decimal, capacity: Decimal) -> bool:
    return Decimal(cargo) <= Decimal(capacity)


def license_active(expiry: date) -> bool:
    return expiry >= date.today()


DISPATCHABLE_VEHICLE_STATUSES = {"Available"}
DISPATCHABLE_DRIVER_STATUSES = {"Available"}
