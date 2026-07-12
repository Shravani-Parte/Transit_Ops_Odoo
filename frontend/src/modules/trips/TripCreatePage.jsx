import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/common/components/Button";
import Step1 from "./components/TripWizard/Step1_RouteInfo";
import Step2 from "./components/TripWizard/Step2_VehicleDriverSelect";
import Step3 from "./components/TripWizard/Step3_CargoValidation";
import Step4 from "./components/TripWizard/Step4_Review";
import { createDraft, validateCargoWithinCapacity } from "./tripsApi";
import useToast from "@/common/hooks/useToast";

const STEPS = ["Route", "Vehicle & Driver", "Cargo", "Review"];

export default function TripCreatePage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { push } = useToast();
  const change = (patch) => setData(d => ({ ...d, ...patch }));

  const validNext = useCallback(() => {
    if (step === 0) return data.source && data.destination && data.planned_distance;
    if (step === 1) return data.vehicle_id && data.driver_id;
    if (step === 2) {
      if (!data.cargo_weight) return false;
      return check?.ok;
    }
    return true;
  }, [step, data, check]);

  // Update check when data changes
  React.useEffect(() => {
    if (step === 2 && data.vehicle_id && data.cargo_weight) {
      validateCargoWithinCapacity(data.vehicle_id, data.cargo_weight).then(c => setCheck(c));
    } else {
      setCheck(null);
    }
  }, [step, data.vehicle_id, data.cargo_weight]);

  const finish = async () => {
    setLoading(true);
    try {
      await createDraft({
        source: data.source, destination: data.destination,
        vehicle_id: data.vehicle_id, driver_id: data.driver_id,
        cargo_weight: Number(data.cargo_weight),
        planned_distance: Number(data.planned_distance),
        revenue: Number(data.revenue || 0),
      });
      push("Trip drafted", "success");
      nav("/trips");
    } catch (e) {
      push(e.response?.data?.detail || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 max-w-3xl">
      <h2>New Trip</h2>
      <div className="flex items-center gap-2 text-xs">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <span className={`px-2 py-1 rounded ${i === step ? "bg-primary text-white" : i < step ? "text-primary" : "text-text-muted"}`}>{i + 1}. {s}</span>
            {i < STEPS.length - 1 && <span className="text-text-subtle">›</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="card p-5">
        {step === 0 && <Step1 data={data} onChange={change} />}
        {step === 1 && <Step2 data={data} onChange={change} />}
        {step === 2 && <Step3 data={data} onChange={change} />}
        {step === 3 && <Step4 data={data} />}
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => step === 0 ? nav("/trips") : setStep(s => s - 1)}>{step === 0 ? "Cancel" : "Back"}</Button>
        {step < STEPS.length - 1 && <Button disabled={!validNext()} onClick={() => setStep(s => s + 1)}>Next</Button>}
        {step === STEPS.length - 1 && <Button disabled={loading} onClick={finish}>{loading ? "Creating..." : "Create Draft"}</Button>}
      </div>
    </div>
  );
}
