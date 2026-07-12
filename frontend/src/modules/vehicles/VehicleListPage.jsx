
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

