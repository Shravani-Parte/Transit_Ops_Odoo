<<<<<<< HEAD
import { useState, useEffect } from "react";
import { listVehicles } from "../vehiclesApi";

export default function useVehicles(filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await listVehicles(filters);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return { data, loading, error, reload: fetchData };
=======
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
