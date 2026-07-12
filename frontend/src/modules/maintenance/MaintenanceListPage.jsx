
import { Plus } from 'lucide-react';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import MaintenanceTable from './components/MaintenanceTable';
import { useMaintenance } from './hooks/useMaintenance';

export default function MaintenanceListPage() {
  const { records, loading } = useMaintenance();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance</h1>
        <Button><Plus size={18} />Create Maintenance</Button>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <MaintenanceTable records={records} />
        </div>
      )}
    </div>
  );
}
