import React, { useState, useEffect } from "react";
import Input from "@/common/components/Input";
import { validateCargoWithinCapacity } from "../../tripsApi";

export default function Step3CargoValidation({ data, onChange }) {
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.vehicle_id && data.cargo_weight) {
      setLoading(true);
      validateCargoWithinCapacity(data.vehicle_id, data.cargo_weight).then(c => {
        setCheck(c);
        setLoading(false);
      }).catch(() => {
        setCheck(null);
        setLoading(false);
      });
    } else {
      setCheck(null);
    }
  }, [data.vehicle_id, data.cargo_weight]);

  return (
    <div className="space-y-3">
      <Input label="Cargo Weight (kg) *" type="number" value={data.cargo_weight || ""} onChange={(e) => onChange({ cargo_weight: e.target.value })} />
      {loading && <div>Checking...</div>}
      {check && !check.ok && <div className="text-sm text-danger border border-red-200 bg-red-50 rounded-md px-3 py-2">{check.reason}</div>}
      {check && check.ok && <div className="text-sm text-success border border-green-200 bg-green-50 rounded-md px-3 py-2">Cargo within vehicle capacity.</div>}
    </div>
  );
}
