import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "@/common/components/Button";
import StatusBadge from "@/common/components/StatusBadge";
import TripStatusStepper from "./components/TripStatusStepper";
import TripCompletionForm from "./components/TripCompletionForm";
import TripCancelDialog from "./components/TripCancelDialog";
import Modal from "@/common/components/Modal";
import { getTrip, dispatchTrip, completeTrip, cancelTrip } from "./tripsApi";
import { db } from "@/store/mockDb";
import { formatCurrency } from "@/common/utils/formatCurrency";
import { formatDateTime } from "@/common/utils/formatDate";
import useToast from "@/common/hooks/useToast";
import useAuth from "@/auth/useAuth";
import { can } from "@/config/permissions";

export default function TripDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tick, setTick] = useState(0);
  const trip = React.useMemo(() => getTrip(id), [id, tick]);
  const [complete, setComplete] = useState(false);
  const [cancel, setCancel] = useState(false);
  const { push } = useToast();
  const { user } = useAuth();
  const canAct = can(user?.role, "trips", "full");
  if (!trip) return <div className="pt-6">Trip not found.</div>;

  const veh = db().vehicles.find(v => v.id === trip.vehicle_id);
  const drv = db().drivers.find(d => d.id === trip.driver_id);

  const Row = ({ l, v }) => <div className="flex justify-between py-1.5 border-b border-border last:border-b-0 text-sm"><span className="text-text-muted">{l}</span><span className="font-medium">{v}</span></div>;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => nav("/trips")}><ArrowLeft size={14} /> Back</Button>
        <h2 className="!text-2xl">Trip {trip.id}</h2>
        <StatusBadge status={trip.status} />
        <div className="ml-auto flex gap-2">
          {canAct && trip.status === "Draft" && <Button onClick={() => { try { dispatchTrip(trip.id); push("Dispatched", "success"); setTick(t => t + 1); } catch (e) { push(e.message, "error"); } }}>Dispatch</Button>}
          {canAct && trip.status === "Dispatched" && <Button onClick={() => setComplete(true)}>Complete</Button>}
          {canAct && ["Draft", "Dispatched"].includes(trip.status) && <Button variant="danger" onClick={() => setCancel(true)}>Cancel Trip</Button>}
        </div>
      </div>

      <div className="card p-4"><TripStatusStepper status={trip.status} /></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-semibold mb-3">Route</div>
          <Row l="Source" v={trip.source} />
          <Row l="Destination" v={trip.destination} />
          <Row l="Planned Distance" v={`${trip.planned_distance} km`} />
          <Row l="Actual Distance" v={trip.actual_distance ? `${trip.actual_distance} km` : "—"} />
          <Row l="Revenue" v={formatCurrency(trip.revenue)} />
        </div>
        <div className="card p-4">
          <div className="font-semibold mb-3">Assignment</div>
          <Row l="Vehicle" v={veh?.registration_number || "—"} />
          <Row l="Driver" v={drv?.name || "—"} />
          <Row l="Cargo" v={`${trip.cargo_weight} kg`} />
          <Row l="Dispatched" v={formatDateTime(trip.dispatched_at)} />
          <Row l="Completed" v={formatDateTime(trip.completed_at)} />
        </div>
      </div>

      <Modal open={complete} onClose={() => setComplete(false)} title="Complete Trip">
        <TripCompletionForm trip={trip} onCancel={() => setComplete(false)} onSubmit={(v) => {
          try { completeTrip(trip.id, v); push("Trip completed", "success"); setComplete(false); setTick(t => t + 1); }
          catch (e) { push(e.message, "error"); }
        }} />
      </Modal>
      <TripCancelDialog open={cancel} onClose={() => setCancel(false)} onConfirm={(reason) => {
        try { cancelTrip(trip.id, reason); push("Trip cancelled", "info"); setCancel(false); setTick(t => t + 1); }
        catch (e) { push(e.message, "error"); }
      }} />
    </div>
  );
}
