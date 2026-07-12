<<<<<<< HEAD
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
=======

import { useState } from 'react';
import Button from '../../../common/components/Button';
import ConfirmDialog from '../../../common/components/ConfirmDialog';
import { useToast } from '../../../common/hooks/useToast';
import { formatCurrency } from '../../../common/utils/formatCurrency';

export default function CloseMaintenanceDialog({ isOpen, onClose, maintenance, onCloseMaintenance }) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onCloseMaintenance(maintenance.maintenance_id);
      onClose();
      addToast({ type: 'success', message: 'Maintenance closed successfully' });
    } catch (error) {
      addToast({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to close maintenance',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!maintenance) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Close Maintenance"
      message={`Are you sure you want to close this maintenance record for ${maintenance.vehicle_name}? The cost is ${formatCurrency(maintenance.cost)}.`}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmButtonText={loading ? 'Closing...' : 'Close Maintenance'}
    />
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
  );
}
