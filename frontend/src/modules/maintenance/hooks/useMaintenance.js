<<<<<<< HEAD
import { useState, useEffect } from "react";
import { listMaintenance } from "../maintenanceApi";

export default function useMaintenance(filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await listMaintenance(filters);
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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
