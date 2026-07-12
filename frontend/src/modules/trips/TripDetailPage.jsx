
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { tripsApi } from './tripsApi';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import StatusBadge from '../../common/components/StatusBadge';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      tripsApi.get(tripId)
        .then(setTrip)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [tripId]);

  if (loading) return <LoadingSpinner />;
  if (!trip) return <div className="text-center py-8">Trip not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{trip.trip_code}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Trip Details</h3>
            <StatusBadge status={trip.status} />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Source</span>
              <span className="font-medium">{trip.source}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Destination</span>
              <span className="font-medium">{trip.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicle</span>
              <span className="font-medium">{trip.vehicle_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Driver</span>
              <span className="font-medium">{trip.driver_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cargo Weight</span>
              <span className="font-medium">{trip.cargo_weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Planned Distance</span>
              <span className="font-medium">{trip.planned_distance} km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

