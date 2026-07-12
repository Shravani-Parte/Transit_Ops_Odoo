
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import Table from '../../common/components/Table';
import { useFuelLogs } from './hooks/useFuelExpense';
import { useAuth } from '../../auth/useAuth';
import { canCreate } from '../../config/permissions';

export default function FuelLogPage() {
  const { logs, loading } = useFuelLogs();
  const { user } = useAuth();

  const columns = [
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'liters', label: 'Liters' },
    { key: 'cost', label: 'Cost' },
    { key: 'log_date', label: 'Date' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fuel Logs</h1>
        <div className="flex gap-2">
          <Link to="/fuel-expenses/expenses"><Button variant="secondary">Expenses</Button></Link>
          {canCreate(user, 'fuel_expense') && (
            <Button><Plus size={18} />Add Fuel Log</Button>
          )}
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table columns={columns} data={logs} />
        </div>
      )}
    </div>
  );
}
