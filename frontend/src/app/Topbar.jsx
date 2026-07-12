<<<<<<< HEAD
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
=======
import { LogOut, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useUI } from '../store/uiStore';
import Button from '../common/components/Button';

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode, sidebarOpen } = useUI();

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700 z-30 flex items-center justify-between px-6 transition-all ${sidebarOpen ? 'left-64' : 'left-16'}`}>
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative">
          <Bell size={18} />
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{user?.full_name}</p>
          <p className="text-xs text-slate-400">{user?.role_name}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}><LogOut size={16} /></Button>
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
      </div>
    </header>
  );
}
