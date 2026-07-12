import React, { useState } from "react";
import Modal from "@/common/components/Modal";
import Button from "@/common/components/Button";
export default function TripCancelDialog({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  return (
    <Modal open={open} onClose={onClose} title="Cancel Trip" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Keep</Button>
        <Button variant="danger" onClick={() => onConfirm(reason)}>Confirm Cancel</Button>
      </>
    }>
      <label className="label">Reason</label>
      <textarea className="input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
      <p className="text-xs text-text-muted mt-2">Cancelling releases the vehicle and driver back to Available.</p>
    </Modal>
  );
}
