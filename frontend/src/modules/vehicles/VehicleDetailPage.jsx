
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { vehiclesApi } from './vehiclesApi';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import StatusBadge from '../../common/components/StatusBadge';

export default function VehicleDetailPage() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vehicleId) {
      vehiclesApi.get(vehicleId)
        .then(setVehicle)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [vehicleId]);

  if (loading) return <LoadingSpinner />;
  if (!vehicle) return <div className="text-center py-8">Vehicle not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{vehicle.vehicle_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Details</h3>
            <StatusBadge status={vehicle.status} />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Registration Number</span>
              <span className="font-medium">{vehicle.registration_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type</span>
              <span className="font-medium">{vehicle.vehicle_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Max Load Capacity</span>
              <span className="font-medium">{vehicle.max_load_capacity} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Odometer</span>
              <span className="font-medium">{vehicle.odometer} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Acquisition Cost</span>
              <span className="font-medium">{vehicle.acquisition_cost}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

