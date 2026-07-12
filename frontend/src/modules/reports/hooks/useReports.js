import { useState, useEffect } from "react";
import { vehicleROI, fuelEfficiency, utilizationSeries, operationalCostSeries, monthlyRevenue } from "../reportsApi";

export default function useReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roi, fuel, utilization, cost, revenue] = await Promise.all([
        vehicleROI(),
        fuelEfficiency(),
        utilizationSeries(),
        operationalCostSeries(),
        monthlyRevenue(),
      ]);
      setData({ roi, fuel, utilization, cost, revenue });
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
