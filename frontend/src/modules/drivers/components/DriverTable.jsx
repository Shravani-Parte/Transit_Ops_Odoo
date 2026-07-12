
import Table from '../../../common/components/Table';
import StatusBadge from '../../../common/components/StatusBadge';

export default function DriverTable({ drivers, onDriverClick }) {
  const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'license_number', label: 'License No.' },
    { key: 'license_category', label: 'Category' },
    { key: 'contact_number', label: 'Contact' },
    { key: 'status', label: 'Status' },
  ];
  return <Table columns={columns} data={drivers} onRowClick={onDriverClick} />;
}

