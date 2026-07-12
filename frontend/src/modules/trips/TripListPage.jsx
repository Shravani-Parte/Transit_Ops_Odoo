<<<<<<< HEAD
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
=======

import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import TripTable from './components/TripTable';
import { useTrips } from './hooks/useTrips';
import { useAuth } from '../../auth/useAuth';
import { canCreate } from '../../config/permissions';

export default function TripListPage() {
  const navigate = useNavigate();
  const { trips, loading } = useTrips();
  const { user } = useAuth();
  console.log('current user:', user);
  console.log('canCreate trip:', canCreate(user, 'trip'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trips</h1>
        {canCreate(user, 'trip') && (
          <Button onClick={() => navigate('/trips/new')}><Plus size={18} />Create Trip</Button>
        )}
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <TripTable trips={trips} onTripClick={(t) => navigate(`/trips/${t.trip_id}`)} />
        </div>
      )}
    </div>
  );
}

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
