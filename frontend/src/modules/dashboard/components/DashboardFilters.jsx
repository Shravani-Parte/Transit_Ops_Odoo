import React from "react";
import Select from "@/common/components/Select";
import { VEHICLE_TYPES, VEHICLE_STATUSES, REGIONS } from "@/config/constants";
import FilterBar from "@/common/components/FilterBar";

export default function DashboardFilters({ filters, setFilter }) {
  return (
    <FilterBar>
      <div className="w-40">
        <Select label="Vehicle Type" value={filters.type || ""} onChange={(e) => setFilter("type", e.target.value)}>
          <option value="">All types</option>
          {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </div>
      <div className="w-40">
        <Select label="Status" value={filters.status || ""} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="">All statuses</option>
          {VEHICLE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>
      <div className="w-40">
        <Select label="Region" value={filters.region || ""} onChange={(e) => setFilter("region", e.target.value)}>
          <option value="">All regions</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </Select>
      </div>
    </FilterBar>
  );
}
