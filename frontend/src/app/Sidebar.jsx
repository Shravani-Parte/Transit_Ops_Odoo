import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Truck, Users, Route as RouteIcon, Wrench,
  Fuel, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import useAuth from "@/auth/useAuth";
import { can, NAV_MODULE_MAP } from "@/config/permissions";

const ITEMS = [
  { to: "/dashboard",   label: "Dashboard",       icon: LayoutDashboard },
  { to: "/fleet",       label: "Fleet",           icon: Truck },
  { to: "/drivers",     label: "Drivers",         icon: Users },
  { to: "/trips",       label: "Trips",           icon: RouteIcon },
  { to: "/maintenance", label: "Maintenance",     icon: Wrench },
  { to: "/fuel",        label: "Fuel & Expenses", icon: Fuel },
  { to: "/analytics",   label: "Analytics",       icon: BarChart3 },
  { to: "/settings",    label: "Settings",        icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <aside className={`bg-white border-r border-border transition-all ${collapsed ? "w-16" : "w-60"} shrink-0 flex flex-col`}>
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 h-14 border-b border-border`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center text-sm font-semibold">T</div>
            <div>
              <div className="font-semibold text-sm leading-tight">TransitOps</div>
              <div className="text-[10px] text-text-muted">Fleet Ops</div>
            </div>
          </div>
        )}
        <button className="btn-ghost !p-1" onClick={() => setCollapsed((c) => !c)} title={collapsed ? "Expand" : "Collapse"}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 py-2">
        {ITEMS.map((item) => {
          const mod = NAV_MODULE_MAP[item.to];
          const disabled = user && mod && !can(user.role, mod, "view");
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 my-0.5 px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-red-50 text-primary font-medium" : "text-text hover:bg-table-rowHover"
                } ${disabled ? "opacity-40 pointer-events-none" : ""}`
              }
            >
              <item.icon size={16} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-2">
        <button
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-text hover:bg-table-rowHover"
          onClick={() => { logout(); nav("/login"); }}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
