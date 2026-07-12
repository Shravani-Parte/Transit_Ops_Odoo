
import { useState, useEffect, useCallback } from 'react';
import { tripsApi } from '../tripsApi';

export function useTrips(filters = {}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    tripsApi.list(filters).then(setTrips).catch(console.error).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => { refresh(); }, [refresh]);

  return { trips, loading, refresh };
}

