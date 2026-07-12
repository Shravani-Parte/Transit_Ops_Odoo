import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-2 p-6 text-text-muted text-sm">
      <Loader2 size={16} className="animate-spin" />
      <span>{label}</span>
    </div>
  );
}
