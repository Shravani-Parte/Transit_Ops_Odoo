
import { useState, useEffect, useCallback } from 'react';
import { maintenanceApi } from '../maintenanceApi';

export function useMaintenance(filters = {}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    maintenanceApi.list(filters).then(setRecords).catch(console.error).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => { refresh(); }, [refresh]);

  return { records, loading, refresh };
}
