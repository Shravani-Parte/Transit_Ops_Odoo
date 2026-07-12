<<<<<<< HEAD
import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/common/components/Button";
import Table from "@/common/components/Table";
import Modal from "@/common/components/Modal";
import FilterBar from "@/common/components/FilterBar";
import ExpenseTypeFilter from "./components/ExpenseTypeFilter";
import ExpenseForm from "./components/ExpenseForm";
import useFilters from "@/common/hooks/useFilters";
import useFuelExpense from "./hooks/useFuelExpense";
import { createExpense } from "./fuelExpenseApi";
import { formatCurrency } from "@/common/utils/formatCurrency";
import { formatDateTime } from "@/common/utils/formatDate";
import { db } from "@/store/mockDb";
import useToast from "@/common/hooks/useToast";
import useAuth from "@/auth/useAuth";
import { can } from "@/config/permissions";

export default function ExpenseLogPage() {
  const { filters, setFilter } = useFilters({ category: "" });
  const { expenses, reload } = useFuelExpense(filters);
  const [add, setAdd] = useState(false);
  const { push } = useToast();
  const { user } = useAuth();
  const canEdit = can(user?.role, "fuel_expense", "full");
  const state = db();
  const columns = [
    { key: "category",    header: "Category" },
    { key: "amount",      header: "Amount", render: (r) => formatCurrency(r.amount) },
    { key: "vehicle_id",  header: "Vehicle", render: (r) => state.vehicles.find(v => v.id === r.vehicle_id)?.registration_number || "—" },
    { key: "trip_id",     header: "Trip", render: (r) => r.trip_id || "—" },
    { key: "notes",       header: "Notes" },
    { key: "incurred_at", header: "Date", render: (r) => formatDateTime(r.incurred_at) },
  ];
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2>Expenses</h2>
        {canEdit && <Button onClick={() => setAdd(true)}><Plus size={14} /> Add Expense</Button>}
      </div>
      <FilterBar><div className="w-48"><ExpenseTypeFilter value={filters.category} onChange={(v) => setFilter("category", v)} /></div></FilterBar>
      <Table columns={columns} rows={expenses} />
      <Modal open={add} onClose={() => setAdd(false)} title="Add Expense">
        <ExpenseForm onCancel={() => setAdd(false)} onSubmit={(v) => {
          try { createExpense(v); push("Expense recorded", "success"); reload(); setAdd(false); }
          catch (e) { push(e.message, "error"); }
        }} />
      </Modal>
=======

import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import StatusBadge from '../../common/components/StatusBadge';
import Table from '../../common/components/Table';
import { useExpenses } from './hooks/useFuelExpense';
import { useAuth } from '../../auth/useAuth';
import { canCreate } from '../../config/permissions';

export default function ExpenseLogPage() {
  const { expenses, loading } = useExpenses();
  const { user } = useAuth();

  const columns = [
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'expense_type', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'expense_date', label: 'Date' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expense Logs</h1>
        <div className="flex gap-2">
          <Link to="/fuel-expenses"><Button variant="secondary">Fuel Logs</Button></Link>
          {canCreate(user, 'fuel_expense') && (
            <Button><Plus size={18} />Add Expense</Button>
          )}
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table columns={columns} data={expenses} />
        </div>
      )}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </div>
  );
}
