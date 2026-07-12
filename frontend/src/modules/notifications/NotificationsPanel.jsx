import React from "react";
import { AlertTriangle } from "lucide-react";
import { licenseExpiryNotifications } from "./notificationsApi";
import { formatDate } from "@/common/utils/formatDate";

export default function NotificationsPanel() {
  const items = licenseExpiryNotifications();
  return (
    <div className="card">
      <div className="px-4 py-3 border-b border-border font-semibold text-sm flex items-center gap-2"><AlertTriangle size={14} className="text-warning" /> Notifications</div>
      <ul className="divide-y divide-border">
        {items.length === 0 && <li className="px-4 py-3 text-sm text-text-muted">All clear.</li>}
        {items.map(n => (
          <li key={n.id} className="px-4 py-3 text-sm">
            <div className="font-medium">License {n.days < 0 ? "expired" : `expires in ${n.days}d`}</div>
            <div className="text-xs text-text-muted">{n.driver_name} · {n.license_number} · {formatDate(n.expires_on)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
