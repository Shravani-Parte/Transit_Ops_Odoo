import React from "react";
import Input from "@/common/components/Input";
export default function Step1RouteInfo({ data, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Input label="Source *" value={data.source || ""} onChange={(e) => onChange({ source: e.target.value })} placeholder="Chennai" />
      <Input label="Destination *" value={data.destination || ""} onChange={(e) => onChange({ destination: e.target.value })} placeholder="Bengaluru" />
      <Input label="Planned Distance (km) *" type="number" value={data.planned_distance || ""} onChange={(e) => onChange({ planned_distance: e.target.value })} />
      <Input label="Revenue (INR)" type="number" value={data.revenue || ""} onChange={(e) => onChange({ revenue: e.target.value })} />
    </div>
  );
}
