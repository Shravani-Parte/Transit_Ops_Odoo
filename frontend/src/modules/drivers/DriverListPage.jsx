
import { Plus } from 'lucide-react';
import { useState } from 'react';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import DriverTable from './components/DriverTable';
import { useDrivers } from './hooks/useDrivers';
import { useAuth } from '../../auth/useAuth';
import { canCreate } from '../../config/permissions';

export default function DriverListPage() {
  const { drivers, loading } = useDrivers();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Drivers</h1>
        {canCreate(user, 'driver') && (
          <Button><Plus size={18} />Add Driver</Button>
        )}
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <DriverTable
            drivers={drivers}
            onDriverClick={(d) => window.location.href = `/drivers/${d.driver_id}`}
          />
        </div>
      )}
    </div>
  );
}

