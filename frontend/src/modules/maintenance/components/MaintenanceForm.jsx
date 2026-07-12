import React, { useState } from "react";
import Input from "@/common/components/Input";
import Select from "@/common/components/Select";
import Button from "@/common/components/Button";
import { db } from "@/store/mockDb";

export default function MaintenanceForm({ onSubmit, onCancel }) {
  const [f, setF] = useState({ vehicle_id: "", category: "Service", description: "", cost: 0 });
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e.target.value }));
  const vehicles = db().vehicles.filter(v => v.status !== "Retired" && v.status !== "On Trip");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-3">
      <p className="text-xs text-text-muted">Only Available / In Shop vehicles are shown. On Trip vehicles cannot open maintenance.</p>
      <Select label="Vehicle *" value={f.vehicle_id} onChange={set("vehicle_id")}>
        <option value="">Select vehicle…</option>
        {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.name_model}</option>)}
      </Select>
      <Input label="Category *" value={f.category} onChange={set("category")} placeholder="Engine / Tyres / Service" />
      <Input label="Description" value={f.description} onChange={set("description")} />
      <Input label="Estimated Cost (INR)" type="number" value={f.cost} onChange={set("cost")} />
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Open Record</Button>
      </div>
    </form>
  );
}
