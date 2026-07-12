
import Table from '../../../common/components/Table';
import StatusBadge from '../../../common/components/StatusBadge';

export default function TripTable({ trips, onTripClick }) {
  const columns = [
    { key: 'trip_code', label: 'Trip Code' },
    { key: 'source', label: 'Source' },
    { key: 'destination', label: 'Destination' },
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'status', label: 'Status' },
  ];
  return <Table columns={columns} data={trips} onRowClick={onTripClick} />;
}

