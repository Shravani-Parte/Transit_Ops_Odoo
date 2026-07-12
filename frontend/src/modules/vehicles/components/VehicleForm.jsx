<<<<<<< HEAD
import React, { useState } from "react";
import Input from "@/common/components/Input";
import Select from "@/common/components/Select";
import Button from "@/common/components/Button";
import { VEHICLE_TYPES, REGIONS } from "@/config/constants";

export default function VehicleForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    registration_number: "", name_model: "", type: "Truck",
    max_load_capacity: "", acquisition_cost: "", region: "South",
    ...initial,
  });
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.registration_number || !form.name_model || !form.max_load_capacity) {
      setError("Fill all required fields"); return;
    }
    try { onSubmit({ ...form, max_load_capacity: Number(form.max_load_capacity), acquisition_cost: Number(form.acquisition_cost || 0) }); }
    catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Registration Number *" value={form.registration_number} onChange={set("registration_number")} placeholder="TN01AB1234" />
        <Input label="Model *" value={form.name_model} onChange={set("name_model")} placeholder="Tata Ace Gold" />
        <Select label="Type *" value={form.type} onChange={set("type")}>{VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}</Select>
        <Select label="Region" value={form.region} onChange={set("region")}>{REGIONS.map(r => <option key={r}>{r}</option>)}</Select>
        <Input label="Max Load Capacity (kg) *" type="number" value={form.max_load_capacity} onChange={set("max_load_capacity")} />
        <Input label="Acquisition Cost (INR)" type="number" value={form.acquisition_cost} onChange={set("acquisition_cost")} />
      </div>
      {error && <div className="text-xs text-danger">{error}</div>}
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">Save</Button>
      </div>
    </form>
=======

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import Select from '../../../common/components/Select';
import Modal from '../../../common/components/Modal';
import { useToast } from '../../../common/hooks/useToast';
import { regionsApi } from '../../regions/regionsApi';

const VEHICLE_TYPES = ['Truck', 'Van', 'Bus', 'Pickup'];
const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];

export default function VehicleForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    registration_number: '',
    vehicle_name: '',
    vehicle_type: '',
    max_load_capacity: '',
    odometer: '0',
    acquisition_cost: '',
    status: 'Available',
    region_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      regionsApi.list().then(setRegions).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        registration_number: initialData.registration_number || '',
        vehicle_name: initialData.vehicle_name || '',
        vehicle_type: initialData.vehicle_type || '',
        max_load_capacity: initialData.max_load_capacity || '',
        odometer: initialData.odometer || '0',
        acquisition_cost: initialData.acquisition_cost || '',
        status: initialData.status || 'Available',
        region_id: initialData.region_id || '',
      });
    } else {
      setFormData({
        registration_number: '',
        vehicle_name: '',
        vehicle_type: '',
        max_load_capacity: '',
        odometer: '0',
        acquisition_cost: '',
        status: 'Available',
        region_id: '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.registration_number.trim()) {
      addToast({ type: 'error', message: 'Registration number is required' });
      return;
    }
    if (!formData.vehicle_name.trim()) {
      addToast({ type: 'error', message: 'Vehicle name is required' });
      return;
    }
    if (!formData.vehicle_type) {
      addToast({ type: 'error', message: 'Vehicle type is required' });
      return;
    }
    
    const maxLoad = parseFloat(formData.max_load_capacity);
    if (isNaN(maxLoad)) {
      addToast({ type: 'error', message: 'Max load capacity must be a number' });
      return;
    }
    
    const acquisitionCost = parseFloat(formData.acquisition_cost);
    if (isNaN(acquisitionCost)) {
      addToast({ type: 'error', message: 'Acquisition cost must be a number' });
      return;
    }

    const payload = {
      registration_number: formData.registration_number.trim(),
      vehicle_name: formData.vehicle_name.trim(),
      vehicle_type: formData.vehicle_type,
      max_load_capacity: maxLoad,
      odometer: parseFloat(formData.odometer) || 0,
      acquisition_cost: acquisitionCost,
      status: formData.status,
      region_id: formData.region_id ? parseInt(formData.region_id) : null,
    };
    console.log('Creating/updating vehicle, payload:', payload);
    
    setLoading(true);
    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to save vehicle',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Vehicle' : 'Add Vehicle'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Registration Number"
          required
          value={formData.registration_number}
          onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
          placeholder="Enter registration number"
        />
        <Input
          label="Vehicle Name/Model"
          required
          value={formData.vehicle_name}
          onChange={(e) => setFormData({ ...formData, vehicle_name: e.target.value })}
          placeholder="Enter vehicle name/model"
        />
        <Select
          label="Type"
          required
          value={formData.vehicle_type}
          onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
          options={[
            { value: '', label: 'Select vehicle type' },
            ...VEHICLE_TYPES.map((t) => ({ value: t, label: t })),
          ]}
        />
        <Select
          label="Region"
          value={formData.region_id}
          onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
          options={[
            { value: '', label: 'No region' },
            ...regions.map((r) => ({ value: r.region_id, label: r.region_name })),
          ]}
        />
        <Input
          label="Maximum Load Capacity (kg)"
          type="number"
          required
          value={formData.max_load_capacity}
          onChange={(e) => setFormData({ ...formData, max_load_capacity: e.target.value })}
          placeholder="Enter max load capacity"
        />
        <Input
          label="Odometer (km)"
          type="number"
          value={formData.odometer}
          onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
          placeholder="Enter odometer reading"
        />
        <Input
          label="Acquisition Cost"
          type="number"
          required
          value={formData.acquisition_cost}
          onChange={(e) => setFormData({ ...formData, acquisition_cost: e.target.value })}
          placeholder="Enter acquisition cost"
        />
        {initialData && (
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={VEHICLE_STATUSES.map((s) => ({ value: s, label: s }))}
          />
        )}
        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
  );
}
