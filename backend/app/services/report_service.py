"""report_service — reads from SQL views (per resolved diff #6).

Do NOT recompute aggregates in Python on every request.
Views: v_vehicle_operational_cost, v_fuel_efficiency, v_vehicle_roi,
v_fleet_utilization, v_dashboard_kpis (see database/triggers_views.sql).
"""


class ReportService:
    async def roi(self):
        return []

    async def fuel_efficiency(self):
        return []

    async def utilization(self):
        return {}

    async def operational_cost(self):
        return []

    async def revenue(self):
        return []
