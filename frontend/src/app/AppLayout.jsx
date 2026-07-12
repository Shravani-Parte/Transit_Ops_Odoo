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
    </div>
  );
}
