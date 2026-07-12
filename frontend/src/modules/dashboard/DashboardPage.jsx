
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
      </div>
    </div>
  );
}

