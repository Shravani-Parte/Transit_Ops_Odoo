import React, { useState } from "react";
import Modal from "@/common/components/Modal";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";

export default function CloseMaintenanceDialog({ open, log, onClose, onConfirm }) {
  const [cost, setCost] = useState(log?.cost || 0);
  React.useEffect(() => setCost(log?.cost || 0), [log]);
  return (
    <Modal open={open} onClose={onClose} title="Close Maintenance Record"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onConfirm(Number(cost))}>Close Record</Button></>}>
      <Input label="Final Cost (INR)" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
      <p className="text-xs text-text-muted mt-2">Closing this record returns the vehicle to Available.</p>
    </Modal>
  );
}
