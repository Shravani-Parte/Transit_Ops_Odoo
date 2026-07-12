import React from "react";
import { db } from "@/store/mockDb";
export default function Step4Review({ data }) {
  const v = db().vehicles.find(x => x.id === data.vehicle_id);
  const d = db().drivers.find(x => x.id === data.driver_id);
  const Row = ({ label, value }) => (
    <div className="flex justify-between py-1.5 border-b border-border last:border-b-0 text-sm">
      <span className="text-text-muted">{label}</span><span className="font-medium">{value}</span>
    </div>
  );
  return (
    <div className="card p-4">
      <Row label="Route" value={`${data.source} → ${data.destination}`} />
      <Row label="Vehicle" value={v ? `${v.registration_number} (${v.name_model})` : "—"} />
      <Row label="Driver" value={d?.name || "—"} />
      <Row label="Cargo" value={`${data.cargo_weight} kg`} />
      <Row label="Distance" value={`${data.planned_distance} km`} />
      <Row label="Revenue" value={data.revenue ? `₹${data.revenue}` : "—"} />
    </div>
  );
}
