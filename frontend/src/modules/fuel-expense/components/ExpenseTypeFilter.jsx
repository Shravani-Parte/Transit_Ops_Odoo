import React from "react";
import Select from "@/common/components/Select";
import { EXPENSE_CATEGORIES } from "@/config/constants";
export default function ExpenseTypeFilter({ value, onChange }) {
  return (
    <Select label="Category" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All</option>{EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
    </Select>
  );
}
