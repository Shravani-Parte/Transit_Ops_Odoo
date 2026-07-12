import React, { useState } from "react";
import Input from "@/common/components/Input";
import Select from "@/common/components/Select";
import Button from "@/common/components/Button";
import { VEHICLE_TYPES, REGIONS } from "@/config/constants";

export default function VehicleForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    registration_number: "", name_model: "", type: "Truck",
    max_load_capacity: "", acquisition_cost: "", region: "South",
    ...initial,
  });
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.registration_number || !form.name_model || !form.max_load_capacity) {
      setError("Fill all required fields"); return;
    }
    try { onSubmit({ ...form, max_load_capacity: Number(form.max_load_capacity), acquisition_cost: Number(form.acquisition_cost || 0) }); }
    catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Registration Number *" value={form.registration_number} onChange={set("registration_number")} placeholder="TN01AB1234" />
        <Input label="Model *" value={form.name_model} onChange={set("name_model")} placeholder="Tata Ace Gold" />
        <Select label="Type *" value={form.type} onChange={set("type")}>{VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}</Select>
        <Select label="Region" value={form.region} onChange={set("region")}>{REGIONS.map(r => <option key={r}>{r}</option>)}</Select>
        <Input label="Max Load Capacity (kg) *" type="number" value={form.max_load_capacity} onChange={set("max_load_capacity")} />
        <Input label="Acquisition Cost (INR)" type="number" value={form.acquisition_cost} onChange={set("acquisition_cost")} />
      </div>
      {error && <div className="text-xs text-danger">{error}</div>}
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
