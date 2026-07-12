import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/common/components/Button";
import SearchBar from "@/common/components/SearchBar";
import Select from "@/common/components/Select";
import FilterBar from "@/common/components/FilterBar";
import Modal from "@/common/components/Modal";
import Pagination from "@/common/components/Pagination";
import useDrivers from "./hooks/useDrivers";
import useFilters from "@/common/hooks/useFilters";
import usePagination from "@/common/hooks/usePagination";
import useDebounce from "@/common/hooks/useDebounce";
import useToast from "@/common/hooks/useToast";
import { DRIVER_STATUSES } from "@/config/constants";
import DriverTable from "./components/DriverTable";
import DriverForm from "./components/DriverForm";
import { createDriver } from "./driversApi";
import useAuth from "@/auth/useAuth";
import { can } from "@/config/permissions";

export default function DriverListPage() {
  const { filters, setFilter } = useFilters({ q: "", status: "" });
  const debounced = useDebounce(filters.q, 250);
  const { items, reload } = useDrivers({ ...filters, q: debounced });
  const { paged, page, setPage, totalPages, total, pageSize } = usePagination(items, 10);
  const [add, setAdd] = useState(false);
  const { push } = useToast();
  const { user } = useAuth();
  const canEdit = can(user?.role, "drivers", "full");
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2>Drivers</h2>
        {canEdit && <Button onClick={() => setAdd(true)}><Plus size={14} />Add Driver</Button>}
      </div>
      <FilterBar>
        <div className="w-64"><SearchBar value={filters.q} onChange={(v) => setFilter("q", v)} placeholder="Search by name or license…" /></div>
        <div className="w-40"><Select label="Status" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}><option value="">All</option>{DRIVER_STATUSES.map(s => <option key={s}>{s}</option>)}</Select></div>
      </FilterBar>
      <DriverTable rows={paged} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} total={total} pageSize={pageSize} />
      <Modal open={add} onClose={() => setAdd(false)} title="Add Driver" size="lg">
        <DriverForm onCancel={() => setAdd(false)} onSubmit={(v) => {
          try { createDriver(v); push("Driver added", "success"); reload(); setAdd(false); }
          catch (e) { push(e.message, "error"); }
        }} />
      </Modal>
    </div>
  );
}
