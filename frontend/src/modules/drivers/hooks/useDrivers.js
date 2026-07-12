
import { useState, useEffect, useCallback } from 'react';
import { driversApi } from '../driversApi';

export function useDrivers(filters = {}) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    driversApi.list(filters).then(setDrivers).catch(console.error).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => { refresh(); }, [refresh]);

  return { drivers, loading, refresh };
}

