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
}
