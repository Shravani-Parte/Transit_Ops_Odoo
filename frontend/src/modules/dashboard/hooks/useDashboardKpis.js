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
}
