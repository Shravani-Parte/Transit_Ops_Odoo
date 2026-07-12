from decimal import Decimal
from pydantic import BaseModel


class VehicleROI(BaseModel):
    vehicle_id: str
    registration_number: str
    acquisition_cost: Decimal
    total_revenue: Decimal
    operational_cost: Decimal
    roi: Decimal | None


class FuelEfficiency(BaseModel):
    vehicle_id: str
    registration_number: str
    total_liters: Decimal
    total_km: Decimal
    km_per_liter: Decimal | None


class UtilizationSnapshot(BaseModel):
    on_trip: int
    available: int
    in_shop: int
    retired: int
    active_fleet: int
