import React from "react";
import { MapPin } from "lucide-react";
import { db } from "@/store/mockDb";
import StatusBadge from "@/common/components/StatusBadge";

export default function ActiveTripsMap() {
  const active = db().trips.filter(t => t.status === "Dispatched");
  return (
    <div className="card p-4">
      <div className="font-semibold mb-3">Active Trips</div>
      <div className="space-y-2">
        {active.length === 0 && <div className="text-sm text-text-muted">No trips in progress.</div>}
        {active.map(t => (
          <div key={t.id} className="flex items-start gap-3 border border-border rounded-md p-3">
            <MapPin size={16} className="text-primary mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium">{t.source} → {t.destination}</div>
              <div className="text-xs text-text-muted">Trip {t.id} · {t.planned_distance} km</div>
            </div>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
