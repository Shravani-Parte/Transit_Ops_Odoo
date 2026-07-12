import React from "react";
import { formatDate, daysUntil } from "@/common/utils/formatDate";
import StatusBadge from "@/common/components/StatusBadge";

export default function DriverComplianceCard({ driver }) {
  const days = daysUntil(driver.license_expiry_date);
  const licenseState = days < 0 ? "Expired" : days <= 30 ? `Expires in ${days}d` : "Valid";
  return (
    <div className="card p-4 space-y-2">
      <div className="font-semibold">Compliance</div>
      <div className="text-sm flex justify-between"><span className="text-text-muted">License</span><span>{driver.license_number}</span></div>
      <div className="text-sm flex justify-between"><span className="text-text-muted">Expiry</span><span className={days < 0 ? "text-danger" : days <= 30 ? "text-warning" : ""}>{formatDate(driver.license_expiry_date)} ({licenseState})</span></div>
      <div className="text-sm flex justify-between"><span className="text-text-muted">Safety Score</span><span className={Number(driver.safety_score) < 80 ? "text-warning" : "text-success"}>{driver.safety_score}</span></div>
      <div className="text-sm flex justify-between items-center"><span className="text-text-muted">Status</span><StatusBadge status={driver.status} /></div>
    </div>
  );
}
