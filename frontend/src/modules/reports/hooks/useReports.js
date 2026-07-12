<<<<<<< HEAD
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
=======

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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
