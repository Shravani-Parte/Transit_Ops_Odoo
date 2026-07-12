import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "@/common/components/Button";
import StatusBadge from "@/common/components/StatusBadge";
import useVehicleDetail from "./hooks/useVehicleDetail";
import VehicleStatusHistory from "./components/VehicleStatusHistory";
import VehicleDocumentsPanel from "./components/VehicleDocumentsPanel";
import VehicleCostSummary from "./components/VehicleCostSummary";
import { formatCurrency } from "@/common/utils/formatCurrency";
import { formatDate } from "@/common/utils/formatDate";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const data = useVehicleDetail(id);
  if (!data) return <div className="pt-6">Vehicle not found. <Button variant="ghost" onClick={() => nav(-1)}>Back</Button></div>;

  const { vehicle, history, maintenance, trips, fuel, expenses } = data;
  const revenue = trips.filter(t => t.status === "Completed").reduce((s, t) => s + Number(t.revenue), 0);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => nav("/fleet")}><ArrowLeft size={14} /> Back</Button>
        <h2 className="!text-2xl">{vehicle.registration_number}</h2>
        <StatusBadge status={vehicle.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="font-semibold mb-3">{vehicle.name_model}</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><div className="text-xs text-text-muted">Type</div><div>{vehicle.type}</div></div>
            <div><div className="text-xs text-text-muted">Region</div><div>{vehicle.region}</div></div>
            <div><div className="text-xs text-text-muted">Capacity</div><div>{vehicle.max_load_capacity} kg</div></div>
            <div><div className="text-xs text-text-muted">Odometer</div><div>{Number(vehicle.odometer).toLocaleString("en-IN")} km</div></div>
            <div><div className="text-xs text-text-muted">Acquisition</div><div>{formatCurrency(vehicle.acquisition_cost)}</div></div>
            <div><div className="text-xs text-text-muted">Registered</div><div>{formatDate(vehicle.created_at)}</div></div>
          </div>
        </div>
        <VehicleCostSummary maintenance={maintenance} fuel={fuel} expenses={expenses} revenue={revenue} acquisition={Number(vehicle.acquisition_cost)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VehicleStatusHistory history={history} />
        <VehicleDocumentsPanel vehicleId={vehicle.id} />
      </div>
    </div>
  );
}
