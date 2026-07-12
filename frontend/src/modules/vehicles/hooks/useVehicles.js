import { useState, useEffect, useCallback } from 'react';
import { vehiclesApi } from '../vehiclesApi';

export function useVehicles(filters = {}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    vehiclesApi.list(filters).then(setVehicles).catch(console.error).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => { refresh(); }, [refresh]);

  return { vehicles, loading, refresh };
}
