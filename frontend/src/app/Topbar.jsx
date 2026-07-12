import React from "react";
import { Bell, Search, User } from "lucide-react";
import useAuth from "@/auth/useAuth";
import { ROLE_LABELS } from "@/config/constants";

export default function Topbar() {
  const { user } = useAuth();
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="relative w-72">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-subtle" />
        <input className="input pl-8 h-9" placeholder="Search vehicles, drivers, trips…" />
      </div>
      <div className="flex items-center gap-4">
        <button className="btn-ghost !p-2 relative" aria-label="Notifications">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center">
            <User size={14} />
          </div>
          <div className="text-sm leading-tight hidden sm:block">
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-text-muted">{ROLE_LABELS[user?.role] || user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
