<<<<<<< HEAD
"""Aggregates all v1 endpoints."""
from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, roles, regions, dashboard, vehicles, vehicle_documents,
    drivers, trips, maintenance, fuel_logs, expenses, reports, exports,
    notifications,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(regions.router, prefix="/regions", tags=["regions"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(vehicle_documents.router, prefix="/vehicle-documents", tags=["vehicle_documents"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
api_router.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"])
api_router.include_router(fuel_logs.router, prefix="/fuel-logs", tags=["fuel_logs"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(exports.router, prefix="/export", tags=["export"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
=======
from fastapi import APIRouter

from app.api.v1.endpoints import auth, drivers, maintenance, reports, roles, trips, vehicles, regions, fuel_logs, expenses

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(vehicles.router)
api_router.include_router(drivers.router)
api_router.include_router(trips.router)
api_router.include_router(maintenance.router)
api_router.include_router(fuel_logs.router)
api_router.include_router(expenses.router)
api_router.include_router(reports.router_fuel)
api_router.include_router(reports.router_expense)
api_router.include_router(reports.router_reports)
api_router.include_router(reports.router_dashboard)
api_router.include_router(roles.router)
api_router.include_router(regions.router)
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
