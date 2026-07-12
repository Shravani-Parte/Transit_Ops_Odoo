<<<<<<< HEAD
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
=======

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { vehiclesApi } from './vehiclesApi';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import StatusBadge from '../../common/components/StatusBadge';
import Button from '../../common/components/Button';
import VehicleForm from './components/VehicleForm';
import VehicleDocumentsPanel from './components/VehicleDocumentsPanel';
import ConfirmDialog from '../../common/components/ConfirmDialog';
import { useToast } from '../../common/hooks/useToast';
import { formatDate } from '../../common/utils/formatDate';
import { formatCurrency } from '../../common/utils/formatCurrency';

export default function VehicleDetailPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [costSummary, setCostSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRetireConfirmOpen, setIsRetireConfirmOpen] = useState(false);
  const { addToast } = useToast();

  const refresh = async () => {
    if (!vehicleId) return;
    const [vehicleData, historyData, costData] = await Promise.all([
      vehiclesApi.get(vehicleId),
      vehiclesApi.history(vehicleId),
      vehiclesApi.costSummary(vehicleId),
    ]);
    setVehicle(vehicleData);
    setStatusHistory(historyData);
    setCostSummary(costData);
  };

  useEffect(() => {
    if (vehicleId) {
      setLoading(true);
      refresh().finally(() => setLoading(false));
    }
  }, [vehicleId]);

  const handleEdit = async (data) => {
    await vehiclesApi.update(vehicleId, data);
    refresh();
    addToast({ type: 'success', message: 'Vehicle updated successfully' });
  };

  const handleRetire = async () => {
    await vehiclesApi.retire(vehicleId);
    refresh();
    addToast({ type: 'success', message: 'Vehicle retired successfully' });
    setIsRetireConfirmOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!vehicle) return <div className="text-center py-8">Vehicle not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/vehicles')}>
          <ArrowLeft size={18} />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{vehicle.vehicle_name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Vehicle Details Card */}
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Details</h3>
            <StatusBadge status={vehicle.status} />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Registration Number</span>
              <span className="font-medium">{vehicle.registration_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type</span>
              <span className="font-medium">{vehicle.vehicle_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Max Load Capacity</span>
              <span className="font-medium">{vehicle.max_load_capacity} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Odometer</span>
              <span className="font-medium">{vehicle.odometer} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Acquisition Cost</span>
              <span className="font-medium">{formatCurrency(vehicle.acquisition_cost)}</span>
            </div>
            {vehicle.region_name && (
              <div className="flex justify-between">
                <span className="text-slate-500">Region</span>
                <span className="font-medium">{vehicle.region_name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => setIsEditModalOpen(true)} variant="secondary" size="sm" className="flex-1">
              <Edit size={16} />
              Edit
            </Button>
            {vehicle.status !== 'Retired' && (
              <Button
                onClick={() => setIsRetireConfirmOpen(true)}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                <Trash2 size={16} />
                Retire
              </Button>
            )}
          </div>
        </div>

        {/* Cost Summary Card */}
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold">Cost Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Fuel Cost</span>
              <span className="font-medium">{formatCurrency(costSummary?.total_fuel_cost || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Maintenance Cost</span>
              <span className="font-medium">{formatCurrency(costSummary?.total_maintenance_cost || 0)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Total Cost</span>
              <span className="font-semibold">{formatCurrency(costSummary?.total_cost || 0)}</span>
            </div>
          </div>
        </div>

        {/* Status History Card */}
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold">Status History</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {statusHistory.length === 0 ? (
              <p className="text-slate-500 text-sm">No status history</p>
            ) : (
              statusHistory.map((history, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex gap-2 items-center mb-1">
                    {history.old_status && (
                      <>
                        <StatusBadge status={history.old_status} />
                        <span className="text-slate-400">→</span>
                      </>
                    )}
                    <StatusBadge status={history.new_status} />
                  </div>
                  <div className="text-xs text-slate-500">
                    {history.reason} • {formatDate(history.changed_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Documents Panel */}
      <VehicleDocumentsPanel vehicleId={vehicleId} />

      {/* Edit Modal */}
      <VehicleForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        initialData={vehicle}
      />

      {/* Retire Confirmation */}
      <ConfirmDialog
        isOpen={isRetireConfirmOpen}
        title="Retire Vehicle"
        message="Are you sure you want to retire this vehicle? It will no longer be available for dispatch."
        onConfirm={handleRetire}
        onCancel={() => setIsRetireConfirmOpen(false)}
      />
    </div>
  );
}

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
