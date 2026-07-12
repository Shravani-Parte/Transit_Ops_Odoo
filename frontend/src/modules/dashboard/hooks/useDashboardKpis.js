<<<<<<< HEAD
import { useState, useEffect } from "react";
import { getDashboardKpis } from "../dashboardApi";

export default function useDashboardKpis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const kpis = await getDashboardKpis();
      setData(kpis);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, reload: fetchData };
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
