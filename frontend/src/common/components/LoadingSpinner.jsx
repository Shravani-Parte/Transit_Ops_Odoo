<<<<<<< HEAD
import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-2 p-6 text-text-muted text-sm">
      <Loader2 size={16} className="animate-spin" />
      <span>{label}</span>
=======
export default function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizes[size]} border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin`} />
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </div>
  );
}
