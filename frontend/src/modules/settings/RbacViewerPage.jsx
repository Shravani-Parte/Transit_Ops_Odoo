<<<<<<< HEAD
import React from "react";
import { ROLE_PERMISSIONS } from "@/config/permissions";
import { ROLE_LABELS } from "@/config/constants";

const MODULES = ["dashboard", "vehicles", "drivers", "trips", "maintenance", "fuel_expense", "reports", "settings"];

export default function RbacViewerPage() {
  const roles = Object.keys(ROLE_PERMISSIONS);
  return (
    <div className="space-y-4 pt-4">
      <h2>Role Permissions</h2>
      <p className="text-sm text-text-muted">Read-only view of the role-permission matrix. Mirrors the <code>role_permissions</code> table (data-driven, per resolved diff #3).</p>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">Module</th>
              {roles.map(r => <th key={r} className="table-th">{ROLE_LABELS[r] || r}</th>)}
            </tr>
          </thead>
          <tbody>
            {MODULES.map(m => (
              <tr key={m} className="table-row">
                <td className="table-td font-medium capitalize">{m.replace("_", " ")}</td>
                {roles.map(r => {
                  const p = ROLE_PERMISSIONS[r]?.[m];
                  return <td key={r} className="table-td">{p === "full" ? <span className="text-success">Full</span> : p === "view" ? <span className="text-info">View</span> : <span className="text-text-subtle">—</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
=======

export default function RbacViewerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Role-Based Access Control</h1>
      <div className="card p-6">
        <p>RBAC viewer coming soon!</p>
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
      </div>
    </div>
  );
}
