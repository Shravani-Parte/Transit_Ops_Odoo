import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const LABELS = {
  dashboard: "Dashboard", fleet: "Fleet", drivers: "Drivers", trips: "Trips",
  maintenance: "Maintenance", fuel: "Fuel Logs", expenses: "Expenses",
  analytics: "Analytics", settings: "Settings", new: "New", rbac: "RBAC", profile: "Profile",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <nav className="text-xs text-text-muted flex items-center gap-1">
      <Link to="/dashboard" className="hover:text-text">Home</Link>
      {parts.map((p, i) => {
        const to = "/" + parts.slice(0, i + 1).join("/");
        const isLast = i === parts.length - 1;
        return (
          <React.Fragment key={to}>
            <ChevronRight size={12} />
            {isLast
              ? <span className="text-text">{LABELS[p] || p}</span>
              : <Link to={to} className="hover:text-text">{LABELS[p] || p}</Link>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
