import React from "react";
import { FileText } from "lucide-react";

export default function VehicleDocumentsPanel({ vehicleId }) {
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Documents</div>
      <div className="text-sm text-text-muted flex items-center gap-2">
        <FileText size={14} /> No documents uploaded yet. (Bonus feature — upload flow not implemented in demo.)
      </div>
    </div>
  );
}
