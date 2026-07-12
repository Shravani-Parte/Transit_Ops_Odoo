import React from "react";
import { Check } from "lucide-react";
const STEPS = ["Draft", "Dispatched", "Completed"];
export default function TripStatusStepper({ status }) {
  if (status === "Cancelled") {
    return <div className="text-sm text-danger">This trip was Cancelled.</div>;
  }
  const idx = STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-2 text-sm ${i <= idx ? "text-primary font-medium" : "text-text-muted"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${i <= idx ? "bg-primary text-white border-primary" : "bg-white border-border text-text-muted"}`}>
              {i < idx ? <Check size={12} /> : i + 1}
            </div>
            {s}
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < idx ? "bg-primary" : "bg-border"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}
