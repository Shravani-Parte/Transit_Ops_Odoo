<<<<<<< HEAD
import React, { useState } from "react";
import Input from "@/common/components/Input";
import Select from "@/common/components/Select";
import Button from "@/common/components/Button";
import { db } from "@/store/mockDb";

export default function MaintenanceForm({ onSubmit, onCancel }) {
  const [f, setF] = useState({ vehicle_id: "", category: "Service", description: "", cost: 0 });
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e.target.value }));
  const vehicles = db().vehicles.filter(v => v.status !== "Retired" && v.status !== "On Trip");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="space-y-3">
      <p className="text-xs text-text-muted">Only Available / In Shop vehicles are shown. On Trip vehicles cannot open maintenance.</p>
      <Select label="Vehicle *" value={f.vehicle_id} onChange={set("vehicle_id")}>
        <option value="">Select vehicle…</option>
        {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.name_model}</option>)}
      </Select>
      <Input label="Category *" value={f.category} onChange={set("category")} placeholder="Engine / Tyres / Service" />
      <Input label="Description" value={f.description} onChange={set("description")} />
      <Input label="Estimated Cost (INR)" type="number" value={f.cost} onChange={set("cost")} />
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Open Record</Button>
      </div>
    </form>
=======

import { useState, useEffect } from 'react';
import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import Select from '../../../common/components/Select';
import Modal from '../../../common/components/Modal';
import { useToast } from '../../../common/hooks/useToast';
import { vehiclesApi } from '../../vehicles/vehiclesApi';

export default function MaintenanceForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    vehicle_id: '',
    maintenance_type: '',
    description: '',
    cost: '',
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      vehiclesApi.list({ available_only: false }).then(setVehicles).catch(console.error);
    }
  }, [isOpen]);

  const availableVehicles = vehicles.filter(
    (v) => v.status !== 'In Shop' && v.status !== 'Retired' && v.status !== 'On Trip'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vehicleId = parseInt(formData.vehicle_id);
    if (!formData.vehicle_id || isNaN(vehicleId)) {
      addToast({
        type: 'error',
        message: 'Please select a vehicle',
      });
      return;
    }
    const payload = {
      ...formData,
      vehicle_id: vehicleId,
      cost: parseFloat(formData.cost) || 0,
    };
    console.log('Creating maintenance, payload:', payload);
    setLoading(true);
    try {
      await onSubmit(payload);
      onClose();
      setFormData({ vehicle_id: '', maintenance_type: '', description: '', cost: '' });
    } catch (error) {
      console.error('Error creating maintenance:', error.response?.data);
      addToast({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to create maintenance record',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Maintenance Record">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Vehicle"
          required
          value={formData.vehicle_id}
          onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
          options={[
            { value: '', label: 'Select vehicle' },
            ...availableVehicles.map((v) => ({
              value: v.vehicle_id,
              label: `${v.vehicle_name} (${v.registration_number})`,
            })),
          ]}
        />
        <Input
          label="Maintenance Type"
          required
          value={formData.maintenance_type}
          onChange={(e) => setFormData({ ...formData, maintenance_type: e.target.value })}
          placeholder="e.g. Oil Change, Tire Rotation"
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Additional details"
        />
        <Input
          label="Cost"
          type="number"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          placeholder="0.00"
        />
        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
  );
}
