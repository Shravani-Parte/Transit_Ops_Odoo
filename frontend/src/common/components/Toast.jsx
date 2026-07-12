import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

const ICONS = { success: CheckCircle2, warning: AlertTriangle, error: XCircle, info: Info };
const TONES = {
  success: "border-green-200 bg-green-50 text-green-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error:   "border-red-200 bg-red-50 text-red-800",
  info:    "border-blue-200 bg-blue-50 text-blue-800",
};

export default function Toast({ toasts = [] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => {
        const Icon = ICONS[t.kind] || Info;
        return (
          <div key={t.id} className={`flex items-start gap-2 border rounded-md p-3 shadow-card ${TONES[t.kind] || TONES.info}`}>
            <Icon size={16} className="mt-0.5" />
            <div className="text-sm">{t.message}</div>
          </div>
        );
      })}
    </div>
  );
}
