
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
  );
}
