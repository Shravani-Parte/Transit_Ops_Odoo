from decimal import Decimal
from pydantic import BaseModel


class DashboardKPIs(BaseModel):
    fleet_utilization: Decimal
    available_vehicles: int
    on_trip_vehicles: int
    in_shop_vehicles: int
    drivers_available: int
    drivers_on_trip: int
    todays_expenses: Decimal
    operational_cost: Decimal
    monthly_fuel_cost: Decimal
    monthly_maintenance_cost: Decimal
