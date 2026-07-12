import React from "react";
import { formatCurrency } from "@/common/utils/formatCurrency";

export default function VehicleCostSummary({ maintenance, fuel, expenses, revenue, acquisition }) {
  const maintCost = maintenance.reduce((s, m) => s + Number(m.cost), 0);
  const fuelCost  = fuel.reduce((s, f) => s + Number(f.cost), 0);
  const expCost   = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const opCost    = maintCost + fuelCost + expCost;
  const roi = acquisition > 0 ? ((revenue - opCost) / acquisition) * 100 : null;

  const Row = ({ label, value, tone }) => (
    <div className="flex justify-between text-sm py-1.5 border-b border-border last:border-b-0">
      <span className="text-text-muted">{label}</span>
      <span className={`font-medium ${tone || ""}`}>{value}</span>
    </div>
  );

  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Cost Summary</div>
      <Row label="Maintenance"     value={formatCurrency(maintCost)} />
      <Row label="Fuel"            value={formatCurrency(fuelCost)} />
      <Row label="Other Expenses"  value={formatCurrency(expCost)} />
      <Row label="Operational Cost" value={formatCurrency(opCost)} />
      <Row label="Revenue"          value={formatCurrency(revenue)} tone="text-success" />
      <Row label="ROI"              value={roi == null ? "—" : `${roi.toFixed(1)}%`} tone={roi >= 0 ? "text-success" : "text-danger"} />
    </div>
  );
}
