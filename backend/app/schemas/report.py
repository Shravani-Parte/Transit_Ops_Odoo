from decimal import Decimal
<<<<<<< HEAD
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
=======
from typing import Optional
from pydantic import BaseModel


class DashboardKpis(BaseModel):
    active_vehicles: int = 0
    available_vehicles: int = 0
    vehicles_in_maintenance: int = 0
    active_trips: int = 0
    pending_trips: int = 0
    drivers_on_duty: int = 0
    fleet_utilization_pct: float = 0.0


class FuelEfficiencyOut(BaseModel):
    trip_id: int
    vehicle_id: int
    actual_distance: Optional[Decimal]
    fuel_consumed: Optional[Decimal]
    km_per_liter: Optional[Decimal]


class VehicleRoiOut(BaseModel):
    vehicle_id: int
    registration_number: str
    acquisition_cost: Decimal
    total_revenue: Decimal
    total_operational_cost: Decimal
    roi: Optional[Decimal]


class OperationalCostOut(BaseModel):
    vehicle_id: int
    registration_number: str
    total_fuel_cost: Decimal
    total_maintenance_cost: Decimal
    total_operational_cost: Decimal


class MonthlyRevenueOut(BaseModel):
    month: str
    revenue: Decimal
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
