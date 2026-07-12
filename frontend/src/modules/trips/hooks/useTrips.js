<<<<<<< HEAD
import { useState, useEffect } from "react";
import { listTrips } from "../tripsApi";

export default function useTrips(filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await listTrips(filters);
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

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
