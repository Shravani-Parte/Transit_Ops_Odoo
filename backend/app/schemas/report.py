from decimal import Decimal
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
