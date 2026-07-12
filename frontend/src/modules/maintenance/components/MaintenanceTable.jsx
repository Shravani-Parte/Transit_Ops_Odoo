
import Table from '../../../common/components/Table';
import StatusBadge from '../../../common/components/StatusBadge';
import Button from '../../../common/components/Button';
import { formatDate } from '../../../common/utils/formatDate';
import { formatCurrency } from '../../../common/utils/formatCurrency';

export default function MaintenanceTable({ records, onCloseMaintenance }) {
  const columns = [
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'maintenance_type', label: 'Type' },
    { key: 'opened_at', label: 'Date Opened', render: (date) => formatDate(date) },
    { key: 'closed_at', label: 'Date Closed', render: (date) => date ? formatDate(date) : '-' },
    { key: 'cost', label: 'Cost', render: (cost) => formatCurrency(cost) },
    { key: 'status', label: 'Status', render: (status) => <StatusBadge status={status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, record) =>
        record.status === 'Open' ? (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCloseMaintenance(record);
            }}
          >
            Close
          </Button>
        ) : null,
    },
  ];
  return <Table columns={columns} data={records} />;
}
