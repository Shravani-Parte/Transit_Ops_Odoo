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
    </div>
  );
}
