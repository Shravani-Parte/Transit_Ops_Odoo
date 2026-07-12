
import Table from '../../../common/components/Table';
import StatusBadge from '../../../common/components/StatusBadge';

export default function MaintenanceTable({ records, onRecordClick }) {
  const columns = [
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'maintenance_type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
  ];
  return <Table columns={columns} data={records} onRowClick={onRecordClick} />;
}
