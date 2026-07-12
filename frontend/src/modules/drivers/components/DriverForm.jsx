import React, { useState } from "react";
import Input from "@/common/components/Input";
import Select from "@/common/components/Select";
import Button from "@/common/components/Button";
import { LICENSE_CATEGORIES } from "@/config/constants";

export default function DriverForm({ initial = {}, onSubmit, onCancel }) {
  const [f, setF] = useState({ name: "", license_number: "", license_category: "LMV", license_expiry_date: "", contact_number: "", ...initial });
  const [err, setErr] = useState(null);
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e.target.value }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); try { onSubmit(f); } catch (er) { setErr(er.message); } }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Name *" value={f.name} onChange={set("name")} />
        <Input label="License Number *" value={f.license_number} onChange={set("license_number")} />
        <Select label="License Category *" value={f.license_category} onChange={set("license_category")}>{LICENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</Select>
        <Input label="License Expiry *" type="date" value={f.license_expiry_date} onChange={set("license_expiry_date")} />
        <Input label="Contact Number" value={f.contact_number} onChange={set("contact_number")} />
      </div>
      {err && <div className="text-xs text-danger">{err}</div>}
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
