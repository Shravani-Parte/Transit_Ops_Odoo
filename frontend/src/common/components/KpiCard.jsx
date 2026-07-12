import React from "react";

export default function KpiCard({ label, value, sublabel, icon: Icon, tone = "default" }) {
  const toneCls = { default: "text-text", success: "text-success", warning: "text-warning", danger: "text-danger", info: "text-info" }[tone];
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-text-muted font-medium">{label}</span>
        {Icon && <Icon size={16} className="text-text-subtle" />}
      </div>
      <div className={`text-2xl font-semibold ${toneCls}`}>{value}</div>
      {sublabel && <div className="text-xs text-text-muted">{sublabel}</div>}
    </div>
  );
}
