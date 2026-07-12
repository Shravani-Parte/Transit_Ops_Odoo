import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "@/common/components/Button";
import StatusBadge from "@/common/components/StatusBadge";
import DriverComplianceCard from "./components/DriverComplianceCard";
import DriverStatusHistory from "./components/DriverStatusHistory";
import { getDriver, driverHistory, suspendDriver, reinstateDriver } from "./driversApi";
import ConfirmDialog from "@/common/components/ConfirmDialog";
import useToast from "@/common/hooks/useToast";
import useAuth from "@/auth/useAuth";
import { can } from "@/config/permissions";

export default function DriverDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tick, setTick] = React.useState(0);
  const driver = React.useMemo(() => getDriver(id), [id, tick]);
  const hist = React.useMemo(() => driverHistory(id), [id, tick]);
  const [confirm, setConfirm] = React.useState(null);
  const { push } = useToast();
  const { user } = useAuth();
  const canManage = can(user?.role, "drivers", "full");
  if (!driver) return <div className="pt-6">Driver not found. <Button variant="ghost" onClick={() => nav(-1)}>Back</Button></div>;
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => nav("/drivers")}><ArrowLeft size={14} /> Back</Button>
        <h2 className="!text-2xl">{driver.name}</h2>
        <StatusBadge status={driver.status} />
        <div className="ml-auto flex gap-2">
          {canManage && driver.status !== "Suspended" && <Button variant="danger" onClick={() => setConfirm("suspend")}>Suspend</Button>}
          {canManage && driver.status === "Suspended" && <Button onClick={() => setConfirm("reinstate")}>Reinstate</Button>}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DriverComplianceCard driver={driver} />
        <DriverStatusHistory history={hist} />
      </div>
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm === "suspend" ? "Suspend driver?" : "Reinstate driver?"}
        message={confirm === "suspend" ? "This driver will be blocked from all trip assignments." : "Driver will be marked Available."}
        confirmLabel={confirm === "suspend" ? "Suspend" : "Reinstate"}
        danger={confirm === "suspend"}
        onConfirm={() => {
          try {
            if (confirm === "suspend") suspendDriver(id, "Manual action");
            else reinstateDriver(id);
            push("Updated", "success"); setConfirm(null); setTick(t => t + 1);
          } catch (e) { push(e.message, "error"); }
        }}
      />
    </div>
  );
}
