
import { Plus, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../common/components/Button';
import Table from '../../common/components/Table';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import StatusBadge from '../../common/components/StatusBadge';
import { useVehicles } from './hooks/useVehicles';

export default function VehicleListPage() {
  const { vehicles, loading } = useVehicles();

  const columns = [
    { key: 'registration_number', label: 'Reg No.' },
    { key: 'vehicle_name', label: 'Name' },
    { key: 'vehicle_type', label: 'Type' },
    { key: 'max_load_capacity', label: 'Max Load' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vehicles</h1>
        <Button>
          <Plus size={18} />
          Add Vehicle
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table
            columns={columns}
            data={vehicles}
            onRowClick={(v) => window.location.href = `/vehicles/${v.vehicle_id}`}
          />
        </div>
      )}
    </div>
  );
}

