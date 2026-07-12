import React from "react";
import Select from "@/common/components/Select";
import useAvailablePool from "../../hooks/useAvailablePool";

export default function Step2VehicleDriverSelect({ data, onChange }) {
  // Only Available vehicles and non-expired, non-suspended drivers per PROCESS.md
  const { vehicles, drivers, loading } = useAvailablePool();
  if (loading) return <div>Loading...</div>;
  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted">Only Available vehicles and drivers with a valid, non-expired license are shown. Retired, In Shop, On Trip, and Suspended entities are filtered out.</p>
      <Select label="Vehicle *" value={data.vehicle_id || ""} onChange={(e) => onChange({ vehicle_id: e.target.value })}>
        <option value="">Select vehicle…</option>
        {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.name_model} (cap {v.max_load_capacity}kg)</option>)}
      </Select>
      <Select label="Driver *" value={data.driver_id || ""} onChange={(e) => onChange({ driver_id: e.target.value })}>
        <option value="">Select driver…</option>
        {drivers.map(d => <option key={d.id} value={d.id}>{d.name} — {d.license_category}</option>)}
      </Select>
    </div>
  );
}
