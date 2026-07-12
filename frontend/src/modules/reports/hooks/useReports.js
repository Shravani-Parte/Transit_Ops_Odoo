
import { useState, useEffect, useCallback } from 'react';
import { reportsApi } from '../reportsApi';

export function useReports() {
  const [fuelEfficiency, setFuelEfficiency] = useState([]);
  const [operationalCost, setOperationalCost] = useState([]);
  const [vehicleRoi, setVehicleRoi] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [fe, oc, vr, mr] = await Promise.all([
        reportsApi.getFuelEfficiency(),
        reportsApi.getOperationalCost(),
        reportsApi.getVehicleRoi(),
        reportsApi.getMonthlyRevenue(),
      ]);
      setFuelEfficiency(fe);
      setOperationalCost(oc);
      setVehicleRoi(vr);
      setMonthlyRevenue(mr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    fuelEfficiency,
    operationalCost,
    vehicleRoi,
    monthlyRevenue,
    loading,
    refresh,
  };
}
