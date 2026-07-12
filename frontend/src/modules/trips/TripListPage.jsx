
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import TripTable from './components/TripTable';
import { useTrips } from './hooks/useTrips';

export default function TripListPage() {
  const navigate = useNavigate();
  const { trips, loading } = useTrips();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trips</h1>
        <Button onClick={() => navigate('/trips/new')}><Plus size={18} />Create Trip</Button>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <TripTable trips={trips} onTripClick={(t) => navigate(`/trips/${t.trip_id}`)} />
        </div>
      )}
    </div>
  );
}

