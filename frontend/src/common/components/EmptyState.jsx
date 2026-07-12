<<<<<<< HEAD
import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No records found", icon: Icon = Inbox }) {
  return (
    <div className="card p-10 flex flex-col items-center justify-center text-center">
      <Icon size={36} className="text-text-subtle mb-3" />
      <div className="text-sm text-text-muted">{message}</div>
=======

export default function EmptyState({ message = "No data available" }) {
  return (
    <div className="p-12 text-center text-slate-500">
      {message}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </div>
  );
}
