<<<<<<< HEAD
import React, { useMemo } from "react";
import useFilters from "@/common/hooks/useFilters";
import useDashboardKpis from "./hooks/useDashboardKpis";
import KpiGrid from "./components/KpiGrid";
import DashboardFilters from "./components/DashboardFilters";
import FleetUtilizationGauge from "./components/FleetUtilizationGauge";
import ActiveTripsMap from "./components/ActiveTripsMap";
import { db } from "@/store/mockDb";
import StatusBadge from "@/common/components/StatusBadge";
import { formatCurrency } from "@/common/utils/formatCurrency";
import { formatDate, daysUntil } from "@/common/utils/formatDate";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { getFuelCostSeries, getUtilizationSeries } from "./dashboardApi";

export default function DashboardPage() {
  const { filters, setFilter } = useFilters({});
  const k = useDashboardKpis(filters);
  const fuelSeries = useMemo(() => getFuelCostSeries(), []);
  const utilSeries = useMemo(() => getUtilizationSeries(), []);
  const state = db();

  const recentTrips = [...state.trips].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  const recentFuel  = [...state.fuel].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at)).slice(0, 5);
  const recentMaint = [...state.maintenance].sort((a, b) => new Date(b.opened_at) - new Date(a.opened_at)).slice(0, 5);
  const licenseExpiring = state.drivers
    .map(d => ({ ...d, days: daysUntil(d.license_expiry_date) }))
    .filter(d => d.days <= 60)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h1>Dashboard</h1>
        <div className="text-xs text-text-muted">Operational overview</div>
      </div>

      <DashboardFilters filters={filters} setFilter={setFilter} />
      <KpiGrid k={k} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FleetUtilizationGauge value={k.fleet_utilization} />
        <div className="card p-4 lg:col-span-2">
          <div className="font-semibold mb-2">Monthly Fuel Cost</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="cost" fill="#C62828" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-semibold mb-2">Trip Statistics (Completed)</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="trips" stroke="#1976D2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <ActiveTripsMap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="px-4 py-3 border-b border-border font-semibold text-sm">Recent Trips</div>
          <table className="w-full">
            <thead><tr>
              <th className="table-th">Trip</th><th className="table-th">Route</th><th className="table-th">Status</th>
            </tr></thead>
            <tbody>
              {recentTrips.map(t => (
                <tr key={t.id} className="table-row">
                  <td className="table-td">{t.id}</td>
                  <td className="table-td">{t.source} → {t.destination}</td>
                  <td className="table-td"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="px-4 py-3 border-b border-border font-semibold text-sm">License Expiry Alerts</div>
          <table className="w-full">
            <thead><tr>
              <th className="table-th">Driver</th><th className="table-th">Expires</th><th className="table-th">Days</th>
            </tr></thead>
            <tbody>
              {licenseExpiring.length === 0 && <tr><td className="table-td text-text-muted" colSpan={3}>No expiries in the next 60 days.</td></tr>}
              {licenseExpiring.map(d => (
                <tr key={d.id} className="table-row">
                  <td className="table-td">{d.name}</td>
                  <td className="table-td">{formatDate(d.license_expiry_date)}</td>
                  <td className="table-td"><span className={d.days < 0 ? "text-danger font-medium" : d.days <= 14 ? "text-warning font-medium" : ""}>{d.days < 0 ? "Expired" : `${d.days}d`}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="px-4 py-3 border-b border-border font-semibold text-sm">Recent Fuel Logs</div>
          <table className="w-full">
            <thead><tr>
              <th className="table-th">Vehicle</th><th className="table-th">Liters</th><th className="table-th">Cost</th>
            </tr></thead>
            <tbody>
              {recentFuel.map(f => {
                const veh = state.vehicles.find(v => v.id === f.vehicle_id);
                return (
                  <tr key={f.id} className="table-row">
                    <td className="table-td">{veh?.registration_number || "—"}</td>
                    <td className="table-td">{f.liters} L</td>
                    <td className="table-td">{formatCurrency(f.cost)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="px-4 py-3 border-b border-border font-semibold text-sm">Recent Maintenance</div>
          <table className="w-full">
            <thead><tr>
              <th className="table-th">Vehicle</th><th className="table-th">Category</th><th className="table-th">Status</th>
            </tr></thead>
            <tbody>
              {recentMaint.map(m => {
                const veh = state.vehicles.find(v => v.id === m.vehicle_id);
                return (
                  <tr key={m.id} className="table-row">
                    <td className="table-td">{veh?.registration_number || "—"}</td>
                    <td className="table-td">{m.category}</td>
                    <td className="table-td"><StatusBadge status={m.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
=======

import { Truck, Car, Wrench, Route, FileCheck, Users, TrendingUp } from 'lucide-react';
import KpiCard from '../../common/components/KpiCard';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { useDashboardKpis } from './hooks/useDashboardKpis';

export default function DashboardPage() {
  const { kpis, loading } = useDashboardKpis();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Vehicles"
          value={kpis?.active_vehicles ?? 0}
          icon={Truck}
          color="brand"
        />
        <KpiCard
          title="Available Vehicles"
          value={kpis?.available_vehicles ?? 0}
          icon={Car}
          color="green"
        />
        <KpiCard
          title="Vehicles in Maintenance"
          value={kpis?.vehicles_in_maintenance ?? 0}
          icon={Wrench}
          color="amber"
        />
        <KpiCard
          title="Active Trips"
          value={kpis?.active_trips ?? 0}
          icon={Route}
          color="blue"
        />
        <KpiCard
          title="Pending Trips"
          value={kpis?.pending_trips ?? 0}
          icon={FileCheck}
          color="brand"
        />
        <KpiCard
          title="Drivers On Duty"
          value={kpis?.drivers_on_duty ?? 0}
          icon={Users}
          color="green"
        />
        <KpiCard
          title="Fleet Utilization"
          value={`${kpis?.fleet_utilization_pct ?? 0}%`}
          icon={TrendingUp}
          color="blue"
        />
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
