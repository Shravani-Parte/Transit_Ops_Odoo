import React, { useState } from "react";
import Input from "@/common/components/Input";
import Select from "@/common/components/Select";
import Button from "@/common/components/Button";
import { db } from "@/store/mockDb";

export default function FuelLogForm({ onSubmit, onCancel }) {
  const [f, setF] = useState({ vehicle_id: "", trip_id: "", liters: "", cost: "", odometer: "" });
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e.target.value }));
  const state = db();
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...f, trip_id: f.trip_id || null }); }} className="space-y-3">
      <Select label="Vehicle *" value={f.vehicle_id} onChange={set("vehicle_id")}>
        <option value="">Select…</option>{state.vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
      </Select>
      <Select label="Trip (optional)" value={f.trip_id} onChange={set("trip_id")}>
        <option value="">None</option>{state.trips.map(t => <option key={t.id} value={t.id}>{t.id} — {t.source}→{t.destination}</option>)}
      </Select>
      <div className="grid grid-cols-3 gap-3">
        <Input label="Liters *" type="number" value={f.liters} onChange={set("liters")} />
        <Input label="Cost (INR) *" type="number" value={f.cost} onChange={set("cost")} />
        <Input label="Odometer (km)" type="number" value={f.odometer} onChange={set("odometer")} />
      </div>
      <div className="flex justify-end gap-2">{onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}<Button type="submit">Save</Button></div>
    </form>
  );
}
