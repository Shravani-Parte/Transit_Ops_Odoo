import React from "react";

export default function DateRangePicker({ from, to, onChange }) {
  return (
    <div className="flex items-end gap-2">
      <div>
        <label className="label">From</label>
        <input type="date" className="input" value={from || ""} onChange={(e) => onChange({ from: e.target.value, to })} />
      </div>
      <div>
        <label className="label">To</label>
        <input type="date" className="input" value={to || ""} onChange={(e) => onChange({ from, to: e.target.value })} />
      </div>
    </div>
  );
}
