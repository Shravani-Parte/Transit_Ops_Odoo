
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
}
