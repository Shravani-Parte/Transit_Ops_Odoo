import React, { useState } from "react";
import Input from "@/common/components/Input";
import Select from "@/common/components/Select";
import Button from "@/common/components/Button";
import { db } from "@/store/mockDb";
import { EXPENSE_CATEGORIES } from "@/config/constants";

export default function ExpenseForm({ onSubmit, onCancel }) {
  const [f, setF] = useState({ vehicle_id: "", trip_id: "", category: "Toll", amount: "", notes: "" });
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e.target.value }));
  const state = db();
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...f, vehicle_id: f.vehicle_id || null, trip_id: f.trip_id || null }); }} className="space-y-3">
      <Select label="Vehicle (optional)" value={f.vehicle_id} onChange={set("vehicle_id")}>
        <option value="">None</option>{state.vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
      </Select>
      <Select label="Trip (optional)" value={f.trip_id} onChange={set("trip_id")}>
        <option value="">None</option>{state.trips.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
      </Select>
      <Select label="Category *" value={f.category} onChange={set("category")}>{EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</Select>
      <Input label="Amount (INR) *" type="number" value={f.amount} onChange={set("amount")} />
      <Input label="Notes" value={f.notes} onChange={set("notes")} />
      <div className="flex justify-end gap-2">{onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}<Button type="submit">Save</Button></div>
    </form>
  );
}
