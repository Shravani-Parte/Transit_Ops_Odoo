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
