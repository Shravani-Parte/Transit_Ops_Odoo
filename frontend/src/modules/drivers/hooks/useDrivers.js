<<<<<<< HEAD
import { useState, useEffect } from "react";
import { listDrivers } from "../driversApi";

export default function useDrivers(filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await listDrivers(filters);
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
}
=======

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

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
