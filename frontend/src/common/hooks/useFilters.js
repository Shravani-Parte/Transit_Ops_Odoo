import { useState } from "react";

export default function useFilters(initial = {}) {
  const [filters, setFilters] = useState(initial);
  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const reset = () => setFilters(initial);
  return { filters, setFilter, setFilters, reset };
}
