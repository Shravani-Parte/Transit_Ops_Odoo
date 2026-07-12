
import { Plus } from 'lucide-react';
import { useState } from 'react';
import Button from '../../common/components/Button';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import MaintenanceTable from './components/MaintenanceTable';
import MaintenanceForm from './components/MaintenanceForm';
import CloseMaintenanceDialog from './components/CloseMaintenanceDialog';
import { useMaintenance } from './hooks/useMaintenance';
import { maintenanceApi } from './maintenanceApi';
import { useToast } from '../../common/hooks/useToast';

export default function MaintenanceListPage() {
  const { records, loading, refresh } = useMaintenance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const { addToast } = useToast();

  const handleCreate = async (data) => {
    await maintenanceApi.create(data);
    refresh();
    addToast({ type: 'success', message: 'Maintenance record created successfully' });
  };

  const handleCloseMaintenance = async (maintenanceId) => {
    await maintenanceApi.close(maintenanceId);
    refresh();
  };

  const handleOpenCloseDialog = (record) => {
    setSelectedMaintenance(record);
    setIsCloseDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={18} />
          Create Maintenance
        </Button>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card p-0 overflow-hidden">
          <MaintenanceTable
            records={records}
            onCloseMaintenance={handleOpenCloseDialog}
          />
        </div>
      )}
      <MaintenanceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />
      <CloseMaintenanceDialog
        isOpen={isCloseDialogOpen}
        onClose={() => setIsCloseDialogOpen(false)}
        maintenance={selectedMaintenance}
        onCloseMaintenance={handleCloseMaintenance}
      />
    </div>
  );
}
