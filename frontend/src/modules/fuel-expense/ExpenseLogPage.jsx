
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import StatusBadge from '../../common/components/StatusBadge';
import Table from '../../common/components/Table';
import { useExpenses } from './hooks/useFuelExpense';
import { useAuth } from '../../auth/useAuth';
import { canCreate } from '../../config/permissions';

export default function ExpenseLogPage() {
  const { expenses, loading } = useExpenses();
  const { user } = useAuth();

  const columns = [
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'expense_type', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'expense_date', label: 'Date' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expense Logs</h1>
        <div className="flex gap-2">
          <Link to="/fuel-expenses"><Button variant="secondary">Fuel Logs</Button></Link>
          {canCreate(user, 'fuel_expense') && (
            <Button><Plus size={18} />Add Expense</Button>
          )}
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table columns={columns} data={expenses} />
        </div>
      )}
    </div>
  );
}
