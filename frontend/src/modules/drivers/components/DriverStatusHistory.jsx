import React from "react";
import { formatDateTime } from "@/common/utils/formatDate";
import EmptyState from "@/common/components/EmptyState";
export default function DriverStatusHistory({ history }) {
  if (!history?.length) return <EmptyState message="No status transitions yet." />;
  return (
    <div className="card">
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">Status History</div>
      <ul className="divide-y divide-border">
        {[...history].reverse().map(h => (
          <li key={h.id} className="px-4 py-3 text-sm flex items-center gap-2">
            <span className="text-text-muted">{h.from_status || "—"}</span><span>→</span>
            <span className="font-medium">{h.to_status}</span>
            <span className="ml-auto text-xs text-text-muted">{formatDateTime(h.changed_at)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
