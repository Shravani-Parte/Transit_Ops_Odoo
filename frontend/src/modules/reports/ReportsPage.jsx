
import LoadingSpinner from '../../common/components/LoadingSpinner';
import Table from '../../common/components/Table';
import Button from '../../common/components/Button';
import { useReports } from './hooks/useReports';
import { reportsApi } from './reportsApi';

export default function ReportsPage() {
  const { vehicleRoi, loading } = useReports();
  console.log('ReportsPage: vehicleRoi =', vehicleRoi);

  const columns = [
    { key: 'registration_number', label: 'Vehicle' },
    { key: 'acquisition_cost', label: 'Acquisition Cost' },
    { key: 'total_revenue', label: 'Total Revenue' },
    { key: 'total_operational_cost', label: 'Operational Cost' },
    { key: 'roi', label: 'ROI' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button onClick={() => reportsApi.exportReport('roi', 'csv')}>Export CSV</Button>
          <Button onClick={() => reportsApi.exportReport('roi', 'pdf')}>Export PDF</Button>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-6 space-y-6">
          <h3 className="text-lg font-semibold">Vehicle ROI</h3>
          <div className="overflow-x-auto">
            <Table columns={columns} data={vehicleRoi} />
          </div>
        </div>
      )}
    </div>
  );
}
