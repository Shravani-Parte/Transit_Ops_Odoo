import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/common/components/Button";
import SearchBar from "@/common/components/SearchBar";
import Select from "@/common/components/Select";
import FilterBar from "@/common/components/FilterBar";
import Modal from "@/common/components/Modal";
import Pagination from "@/common/components/Pagination";
import useVehicles from "./hooks/useVehicles";
import useFilters from "@/common/hooks/useFilters";
import usePagination from "@/common/hooks/usePagination";
import useDebounce from "@/common/hooks/useDebounce";
import useToast from "@/common/hooks/useToast";
import { VEHICLE_STATUSES, VEHICLE_TYPES, REGIONS } from "@/config/constants";
import VehicleTable from "./components/VehicleTable";
import VehicleForm from "./components/VehicleForm";
import { createVehicle } from "./vehiclesApi";
import useAuth from "@/auth/useAuth";
import { can } from "@/config/permissions";

export default function VehicleListPage() {
  const { filters, setFilter } = useFilters({ q: "", status: "", type: "", region: "" });
  const debounced = useDebounce(filters.q, 250);
  const { items, reload } = useVehicles({ ...filters, q: debounced });
  const { paged, page, setPage, totalPages, total, pageSize } = usePagination(items, 10);
  const [showAdd, setShowAdd] = useState(false);
  const { push } = useToast();
  const { user } = useAuth();
  const canEdit = can(user?.role, "vehicles", "full");

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2>Fleet</h2>
        {canEdit && <Button onClick={() => setShowAdd(true)}><Plus size={14} />Add Vehicle</Button>}
      </div>

      <FilterBar>
        <div className="w-64"><SearchBar value={filters.q} onChange={(v) => setFilter("q", v)} placeholder="Search by registration or model…" /></div>
        <div className="w-40"><Select label="Status" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}><option value="">All</option>{VEHICLE_STATUSES.map(s => <option key={s}>{s}</option>)}</Select></div>
        <div className="w-40"><Select label="Type" value={filters.type} onChange={(e) => setFilter("type", e.target.value)}><option value="">All</option>{VEHICLE_TYPES.map(s => <option key={s}>{s}</option>)}</Select></div>
        <div className="w-40"><Select label="Region" value={filters.region} onChange={(e) => setFilter("region", e.target.value)}><option value="">All</option>{REGIONS.map(s => <option key={s}>{s}</option>)}</Select></div>
      </FilterBar>

      <VehicleTable rows={paged} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} total={total} pageSize={pageSize} />

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Vehicle" size="lg">
        <VehicleForm
          onSubmit={(v) => {
            try { createVehicle(v); push("Vehicle created", "success"); reload(); setShowAdd(false); }
            catch (e) { push(e.message, "error"); }
          }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>
    </div>
  );
}
