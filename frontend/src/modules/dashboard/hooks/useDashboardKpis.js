import { useState, useEffect } from 'react';
import { dashboardApi } from './dashboardApi';

export function useDashboardKpis(filters = {}) {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dashboardApi.getKpis(filters)
      .then(setKpis)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { kpis, loading };
}
