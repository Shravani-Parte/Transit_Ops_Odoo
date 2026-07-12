from decimal import Decimal

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.driver import Driver
from app.models.trip import Trip
from app.models.vehicle import Vehicle
from app.schemas.report import DashboardKpis


def get_dashboard_kpis(db: Session, vehicle_type: str | None = None, status: str | None = None, region_id: int | None = None) -> DashboardKpis:
    vq = db.query(Vehicle).filter(Vehicle.is_deleted == False, Vehicle.status != "Retired")
    if vehicle_type:
        vq = vq.filter(Vehicle.vehicle_type == vehicle_type)
    if status:
        vq = vq.filter(Vehicle.status == status)
    if region_id:
        vq = vq.filter(Vehicle.region_id == region_id)

    vehicles = vq.all()
    active = len(vehicles)
    available = sum(1 for v in vehicles if v.status == "Available")
    in_shop = sum(1 for v in vehicles if v.status == "In Shop")
    on_trip = sum(1 for v in vehicles if v.status == "On Trip")
    utilization = round((on_trip / active * 100) if active > 0 else 0, 2)

    active_trips = db.query(Trip).filter(Trip.status == "Dispatched").count()
    pending_trips = db.query(Trip).filter(Trip.status == "Draft").count()
    drivers_on_duty = db.query(Driver).filter(Driver.status == "On Trip").count()

    return DashboardKpis(
        active_vehicles=active,
        available_vehicles=available,
        vehicles_in_maintenance=in_shop,
        active_trips=active_trips,
        pending_trips=pending_trips,
        drivers_on_duty=drivers_on_duty,
        fleet_utilization_pct=utilization,
    )


def get_fuel_efficiency(db: Session) -> list[dict]:
    trips = db.query(Trip).filter(Trip.status == "Completed", Trip.fuel_consumed > 0).all()
    return [
        {
            "trip_id": t.trip_id,
            "vehicle_id": t.vehicle_id,
            "actual_distance": t.actual_distance,
            "fuel_consumed": t.fuel_consumed,
            "km_per_liter": float(t.actual_distance / t.fuel_consumed) if t.fuel_consumed else None,
        }
        for t in trips
    ]


def get_operational_costs(db: Session) -> list[dict]:
    from app.models.fuel_log import FuelLog
    from app.models.maintenance_log import MaintenanceLog

    vehicles = db.query(Vehicle).filter(Vehicle.is_deleted == False).all()
    result = []
    for v in vehicles:
        fuel_cost = db.query(FuelLog).filter(FuelLog.vehicle_id == v.vehicle_id).with_entities(
            db.query(FuelLog.cost).filter(FuelLog.vehicle_id == v.vehicle_id).statement
        )
        total_fuel = sum(float(f.cost) for f in db.query(FuelLog).filter(FuelLog.vehicle_id == v.vehicle_id).all())
        total_maint = sum(float(m.cost) for m in db.query(MaintenanceLog).filter(MaintenanceLog.vehicle_id == v.vehicle_id).all())
        result.append({
            "vehicle_id": v.vehicle_id,
            "registration_number": v.registration_number,
            "total_fuel_cost": Decimal(str(total_fuel)),
            "total_maintenance_cost": Decimal(str(total_maint)),
            "total_operational_cost": Decimal(str(total_fuel + total_maint)),
        })
    return result


def get_vehicle_roi(db: Session) -> list[dict]:
    costs = {c["vehicle_id"]: c for c in get_operational_costs(db)}
    vehicles = db.query(Vehicle).filter(Vehicle.is_deleted == False).all()
    result = []
    for v in vehicles:
        revenue = sum(float(t.revenue) for t in db.query(Trip).filter(Trip.vehicle_id == v.vehicle_id, Trip.status == "Completed").all())
        op_cost = float(costs.get(v.vehicle_id, {}).get("total_operational_cost", 0))
        acq = float(v.acquisition_cost)
        roi = (revenue - op_cost) / acq if acq > 0 else None
        result.append({
            "vehicle_id": v.vehicle_id,
            "registration_number": v.registration_number,
            "acquisition_cost": v.acquisition_cost,
            "total_revenue": Decimal(str(revenue)),
            "total_operational_cost": Decimal(str(op_cost)),
            "roi": Decimal(str(round(roi, 4))) if roi is not None else None,
        })
    return result


def get_monthly_revenue(db: Session) -> list[dict]:
    trips = db.query(Trip).filter(Trip.status == "Completed", Trip.completed_at != None).all()
    monthly = {}
    for t in trips:
        if t.completed_at:
            key = t.completed_at.strftime("%Y-%m")
            monthly[key] = monthly.get(key, 0) + float(t.revenue)
    return [{"month": k, "revenue": Decimal(str(v))} for k, v in sorted(monthly.items())]


def export_csv(db: Session, report_type: str) -> str:
    import io
    import pandas as pd

    if report_type == "roi":
        data = get_vehicle_roi(db)
    elif report_type == "fuel-efficiency":
        data = get_fuel_efficiency(db)
    elif report_type == "operational-cost":
        data = get_operational_costs(db)
    else:
        data = [get_dashboard_kpis(db).model_dump()]

    df = pd.DataFrame(data)
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    return buffer.getvalue()
