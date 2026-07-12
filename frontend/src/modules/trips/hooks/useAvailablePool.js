import { useState, useEffect } from "react";
import { availableVehicles, eligibleDrivers } from "../tripsApi";

export default function useAvailablePool() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [vs, ds] = await Promise.all([availableVehicles(), eligibleDrivers()]);
      setVehicles(vs);
      setDrivers(ds);
      setLoading(false);
    };
    fetch();
  }, []);

  return { vehicles, drivers, loading };
}
