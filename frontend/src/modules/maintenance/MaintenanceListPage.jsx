import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/common/components/Button";
import Select from "@/common/components/Select";
import FilterBar from "@/common/components/FilterBar";
import Modal from "@/common/components/Modal";
import useMaintenance from "./hooks/useMaintenance";
import useFilters from "@/common/hooks/useFilters";
import MaintenanceTable from "./components/MaintenanceTable";
import MaintenanceForm from "./components/MaintenanceForm";
import CloseMaintenanceDialog from "./components/CloseMaintenanceDialog";
import { openMaintenance, closeMaintenance } from "./maintenanceApi";
import { MAINTENANCE_STATUSES } from "@/config/constants";
import useToast from "@/common/hooks/useToast";
import useAuth from "@/auth/useAuth";
import { can } from "@/config/permissions";

export default function MaintenanceListPage() {
  const { filters, setFilter } = useFilters({ status: "" });
  const { items, reload } = useMaintenance(filters);
  const [add, setAdd] = useState(false);
  const [closing, setClosing] = useState(null);
  const { push } = useToast();
  const { user } = useAuth();
  const canEdit = can(user?.role, "maintenance", "full");
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2>Maintenance</h2>
        {canEdit && <Button onClick={() => setAdd(true)}><Plus size={14} /> Open Record</Button>}
      </div>
      <FilterBar>
        <div className="w-40"><Select label="Status" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}><option value="">All</option>{MAINTENANCE_STATUSES.map(s => <option key={s}>{s}</option>)}</Select></div>
      </FilterBar>
      <MaintenanceTable rows={items} onClose={(r) => setClosing(r)} />
      <Modal open={add} onClose={() => setAdd(false)} title="Open Maintenance Record">
        <MaintenanceForm onCancel={() => setAdd(false)} onSubmit={(v) => {
          try { openMaintenance(v); push("Maintenance opened", "success"); reload(); setAdd(false); }
          catch (e) { push(e.message, "error"); }
        }} />
      </Modal>
      <CloseMaintenanceDialog open={!!closing} log={closing} onClose={() => setClosing(null)} onConfirm={(cost) => {
        try { closeMaintenance(closing.id, cost); push("Record closed", "success"); reload(); setClosing(null); }
        catch (e) { push(e.message, "error"); }
      }} />
    </div>
  );
}
