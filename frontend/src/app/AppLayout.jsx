<<<<<<< HEAD
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Breadcrumbs from "./Breadcrumbs";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="px-6 pt-4"><Breadcrumbs /></div>
        <main className="flex-1 px-6 pb-8">
          <Outlet />
        </main>
      </div>
=======
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUI } from '../store/uiStore';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/fleet': 'Fleet Registry',
  '/drivers': 'Driver Management',
  '/trips': 'Trip Management',
  '/maintenance': 'Maintenance',
  '/fuel-expenses': 'Fuel & Expenses',
  '/analytics': 'Analytics & Reports',
  '/settings': 'Settings',
};

export default function AppLayout() {
  const { sidebarOpen } = useUI();
  const title = TITLES[window.location.pathname] || 'TransitOps';

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Topbar title={title} />
      <main className={`pt-16 min-h-screen transition-all ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </div>
  );
}
