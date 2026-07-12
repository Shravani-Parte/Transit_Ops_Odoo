import { useState, useEffect } from "react";
import { getVehicle, statusHistory } from "../vehiclesApi";
import { listMaintenance } from "../../maintenance/maintenanceApi";
import { listTrips } from "../../trips/tripsApi";
import { listFuel, listExpenses } from "../../fuel-expense/fuelExpenseApi";

export default function useVehicleDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehicle, history, maintenance, trips, fuel, expenses] = await Promise.all([
        getVehicle(id),
        statusHistory(id),
        listMaintenance(),
        listTrips(),
        listFuel(),
        listExpenses(),
      ]);
      setData({
        vehicle,
        history,
        maintenance: maintenance?.items?.filter(m => m.vehicle_id === id) || [],
        trips: trips?.items?.filter(t => t.vehicle_id === id) || [],
        fuel: fuel?.items?.filter(f => f.vehicle_id === id) || [],
        expenses: expenses?.items?.filter(e => e.vehicle_id === id) || [],
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  return { ...data, loading, error, reload: fetchData };
}
