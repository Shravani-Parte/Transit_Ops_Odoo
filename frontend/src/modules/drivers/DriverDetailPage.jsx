
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { driversApi } from './driversApi';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import StatusBadge from '../../common/components/StatusBadge';

export default function DriverDetailPage() {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driverId) {
      driversApi.get(driverId)
        .then(setDriver)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [driverId]);

  if (loading) return <LoadingSpinner />;
  if (!driver) return <div className="text-center py-8">Driver not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{driver.full_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Details</h3>
            <StatusBadge status={driver.status} />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">License Number</span>
              <span className="font-medium">{driver.license_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">License Category</span>
              <span className="font-medium">{driver.license_category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">License Expiry</span>
              <span className={`font-medium ${!driver.license_valid ? 'text-red-500' : ''}`}>{driver.license_expiry_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact</span>
              <span className="font-medium">{driver.contact_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Safety Score</span>
              <span className="font-medium">{driver.safety_score}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

