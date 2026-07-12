<<<<<<< HEAD
import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/common/components/Button";
import Table from "@/common/components/Table";
import Modal from "@/common/components/Modal";
import useFuelExpense from "./hooks/useFuelExpense";
import FuelLogForm from "./components/FuelLogForm";
import { createFuel } from "./fuelExpenseApi";
import { formatCurrency } from "@/common/utils/formatCurrency";
import { formatDateTime } from "@/common/utils/formatDate";
import { db } from "@/store/mockDb";
import useToast from "@/common/hooks/useToast";
import useAuth from "@/auth/useAuth";
import { can } from "@/config/permissions";

export default function FuelLogPage() {
  const { fuel, reload } = useFuelExpense({});
  const [add, setAdd] = useState(false);
  const { push } = useToast();
  const { user } = useAuth();
  const canEdit = can(user?.role, "fuel_expense", "full");
  const state = db();
  const columns = [
    { key: "vehicle_id", header: "Vehicle", render: (r) => state.vehicles.find(v => v.id === r.vehicle_id)?.registration_number || "—" },
    { key: "trip_id",    header: "Trip", render: (r) => r.trip_id || "—" },
    { key: "liters",     header: "Liters" },
    { key: "cost",       header: "Cost", render: (r) => formatCurrency(r.cost) },
    { key: "odometer",   header: "Odometer" },
    { key: "logged_at",  header: "Logged", render: (r) => formatDateTime(r.logged_at) },
  ];
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2>Fuel Logs</h2>
        {canEdit && <Button onClick={() => setAdd(true)}><Plus size={14} /> Log Fuel</Button>}
      </div>
      <Table columns={columns} rows={fuel} />
      <Modal open={add} onClose={() => setAdd(false)} title="Log Fuel">
        <FuelLogForm onCancel={() => setAdd(false)} onSubmit={(v) => {
          try { createFuel(v); push("Fuel logged", "success"); reload(); setAdd(false); }
          catch (e) { push(e.message, "error"); }
        }} />
      </Modal>
=======

import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import Table from '../../common/components/Table';
import { useFuelLogs } from './hooks/useFuelExpense';
import { useAuth } from '../../auth/useAuth';
import { canCreate } from '../../config/permissions';

export default function FuelLogPage() {
  const { logs, loading } = useFuelLogs();
  const { user } = useAuth();

  const columns = [
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'liters', label: 'Liters' },
    { key: 'cost', label: 'Cost' },
    { key: 'log_date', label: 'Date' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fuel Logs</h1>
        <div className="flex gap-2">
          <Link to="/fuel-expenses/expenses"><Button variant="secondary">Expenses</Button></Link>
          {canCreate(user, 'fuel_expense') && (
            <Button><Plus size={18} />Add Fuel Log</Button>
          )}
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table columns={columns} data={logs} />
        </div>
      )}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </div>
  );
}
