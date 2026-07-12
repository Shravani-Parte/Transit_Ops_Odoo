<<<<<<< HEAD
import { useState, useEffect } from "react";
import { listFuel, listExpenses } from "../fuelExpenseApi";

export default function useFuelExpense(filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fuel, expenses] = await Promise.all([listFuel(), listExpenses(filters)]);
      setData({ fuel, expenses });
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
import { fuelExpenseApi } from '../fuelExpenseApi';

export function useFuelLogs(filters = {}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fuelExpenseApi.listFuelLogs(filters).then(setLogs).catch(console.error).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => { refresh(); }, [refresh]);

  return { logs, loading, refresh };
}

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fuelExpenseApi.listExpenses(filters).then(setExpenses).catch(console.error).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => { refresh(); }, [refresh]);

  return { expenses, loading, refresh };
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
