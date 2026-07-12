import React from "react";
import KpiCard from "@/common/components/KpiCard";
import { Truck, CircleCheck, Wrench, Users, UserCheck, IndianRupee, TrendingUp, Fuel, ClipboardList, Gauge } from "lucide-react";
import { formatCurrency } from "@/common/utils/formatCurrency";

export default function KpiGrid({ k }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard label="Fleet Utilization"     value={`${k.fleet_utilization}%`}       icon={Gauge}      tone="info" />
      <KpiCard label="Available Vehicles"    value={k.available_vehicles}            icon={CircleCheck}tone="success" />
      <KpiCard label="On Trip Vehicles"      value={k.on_trip_vehicles}              icon={Truck}      tone="info" />
      <KpiCard label="In Shop Vehicles"      value={k.in_shop_vehicles}              icon={Wrench}     tone="warning" />
      <KpiCard label="Drivers Available"     value={k.drivers_available}             icon={UserCheck}  tone="success" />
      <KpiCard label="Drivers On Trip"       value={k.drivers_on_trip}               icon={Users}      tone="info" />
      <KpiCard label="Today's Expenses"      value={formatCurrency(k.todays_expenses)}    icon={IndianRupee} />
      <KpiCard label="Operational Cost"      value={formatCurrency(k.operational_cost)}   icon={TrendingUp} />
      <KpiCard label="Monthly Fuel Cost"     value={formatCurrency(k.monthly_fuel_cost)}  icon={Fuel} />
      <KpiCard label="Monthly Maintenance"   value={formatCurrency(k.monthly_maintenance_cost)} icon={ClipboardList} />
    </div>
  );
}
