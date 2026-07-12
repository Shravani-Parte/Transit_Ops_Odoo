<<<<<<< HEAD
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
=======

import { Plus, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/components/Button';
import Table from '../../common/components/Table';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import StatusBadge from '../../common/components/StatusBadge';
import SearchBar from '../../common/components/SearchBar';
import Select from '../../common/components/Select';
import VehicleForm from './components/VehicleForm';
import { useVehicles } from './hooks/useVehicles';
import { regionsApi } from '../regions/regionsApi';
import { vehiclesApi } from './vehiclesApi';
import { useToast } from '../../common/hooks/useToast';

const VEHICLE_TYPES = ['Truck', 'Van', 'Bus', 'Pickup'];
const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];

export default function VehicleListPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', vehicle_type: '', region_id: '' });
  const [regions, setRegions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { vehicles, loading, refresh } = useVehicles({ ...filters, search });

  useEffect(() => {
    regionsApi.list().then(setRegions).catch(console.error);
  }, []);

  const handleCreate = async (data) => {
    await vehiclesApi.create(data);
    refresh();
    addToast({ type: 'success', message: 'Vehicle created successfully' });
  };

  const columns = [
    { key: 'registration_number', label: 'Reg No.' },
    { key: 'vehicle_name', label: 'Name/Model' },
    { key: 'vehicle_type', label: 'Type' },
    { key: 'odometer', label: 'Odometer (km)' },
    { key: 'acquisition_cost', label: 'Acquisition Cost' },
    { key: 'status', label: 'Status', render: (status) => <StatusBadge status={status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vehicles</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={18} />
          Add Vehicle
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar
          placeholder="Search vehicles..."
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Status"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          options={[{ value: '', label: 'All' }, ...VEHICLE_STATUSES.map((s) => ({ value: s, label: s }))]}
        />
        <Select
          label="Type"
          value={filters.vehicle_type}
          onChange={(e) => setFilters({ ...filters, vehicle_type: e.target.value })}
          options={[{ value: '', label: 'All' }, ...VEHICLE_TYPES.map((t) => ({ value: t, label: t }))]}
        />
        <Select
          label="Region"
          value={filters.region_id}
          onChange={(e) => setFilters({ ...filters, region_id: e.target.value })}
          options={[{ value: '', label: 'All' }, ...regions.map((r) => ({ value: r.region_id, label: r.region_name }))]}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table
            columns={columns}
            data={vehicles}
            onRowClick={(v) => navigate(`/vehicles/${v.vehicle_id}`)}
          />
        </div>
      )}

      <VehicleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
