import React from "react";
import useReports from "./hooks/useReports";
import FuelEfficiencyChart from "./components/FuelEfficiencyChart";
import FleetUtilizationChart from "./components/FleetUtilizationChart";
import OperationalCostChart from "./components/OperationalCostChart";
import VehicleRoiTable from "./components/VehicleRoiTable";
import MonthlyRevenueWidget from "./components/MonthlyRevenueWidget";
import ExportButtons from "./components/ExportButtons";

export default function ReportsPage() {
  const r = useReports();
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2>Analytics</h2>
        <ExportButtons rows={r.roi} filename="vehicle_roi.csv" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FleetUtilizationChart data={r.utilization} />
        <OperationalCostChart data={r.cost} />
        <FuelEfficiencyChart data={r.fuel} />
        <MonthlyRevenueWidget data={r.revenue} />
      </div>
      <div className="card">
        <div className="px-4 py-3 border-b border-border font-semibold text-sm">Vehicle ROI</div>
        <VehicleRoiTable data={r.roi} />
      </div>
    </div>
  );
}
