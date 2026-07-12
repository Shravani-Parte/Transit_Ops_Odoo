import React from "react";
import { Plus } from "lucide-react";
import Button from "@/common/components/Button";
import SearchBar from "@/common/components/SearchBar";
import Select from "@/common/components/Select";
import FilterBar from "@/common/components/FilterBar";
import Pagination from "@/common/components/Pagination";
import useTrips from "./hooks/useTrips";
import useFilters from "@/common/hooks/useFilters";
import usePagination from "@/common/hooks/usePagination";
import useDebounce from "@/common/hooks/useDebounce";
import { TRIP_STATUSES } from "@/config/constants";
import TripTable from "./components/TripTable";
import { useNavigate } from "react-router-dom";
import useAuth from "@/auth/useAuth";
import { can } from "@/config/permissions";

export default function TripListPage() {
  const { filters, setFilter } = useFilters({ q: "", status: "" });
  const dq = useDebounce(filters.q, 250);
  const { items } = useTrips({ ...filters, q: dq });
  const { paged, page, setPage, totalPages, total, pageSize } = usePagination(items, 10);
  const nav = useNavigate();
  const { user } = useAuth();
  const canCreate = can(user?.role, "trips", "full");
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2>Trips</h2>
        {canCreate && <Button onClick={() => nav("/trips/new")}><Plus size={14} /> New Trip</Button>}
      </div>
      <FilterBar>
        <div className="w-64"><SearchBar value={filters.q} onChange={(v) => setFilter("q", v)} placeholder="Search by source, destination, id…" /></div>
        <div className="w-40"><Select label="Status" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}><option value="">All</option>{TRIP_STATUSES.map(s => <option key={s}>{s}</option>)}</Select></div>
      </FilterBar>
      <TripTable rows={paged} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} total={total} pageSize={pageSize} />
    </div>
  );
}
