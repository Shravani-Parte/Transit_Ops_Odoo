<<<<<<< HEAD
import React from "react";
import { FileText } from "lucide-react";

export default function VehicleDocumentsPanel({ vehicleId }) {
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Documents</div>
      <div className="text-sm text-text-muted flex items-center gap-2">
        <FileText size={14} /> No documents uploaded yet. (Bonus feature — upload flow not implemented in demo.)
      </div>
=======

import { useState, useEffect } from 'react';
import { Plus, Download, Trash2, Upload } from 'lucide-react';
import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import Select from '../../../common/components/Select';
import Modal from '../../../common/components/Modal';
import ConfirmDialog from '../../../common/components/ConfirmDialog';
import { useToast } from '../../../common/hooks/useToast';
import { vehiclesApi } from '../vehiclesApi';
import { formatDate } from '../../../common/utils/formatDate';

const DOCUMENT_TYPES = ['Insurance', 'Registration', 'Maintenance', 'Other'];

export default function VehicleDocumentsPanel({ vehicleId }) {
  const [documents, setDocuments] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    document_type: '',
    file_url: '',
    expiry_date: '',
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const refresh = () => {
    if (vehicleId) {
      vehiclesApi.documents.list(vehicleId).then(setDocuments).catch(console.error);
    }
  };

  useEffect(() => { refresh(); }, [vehicleId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vehiclesApi.documents.create(vehicleId, formData);
      refresh();
      setIsAddModalOpen(false);
      setFormData({ document_type: '', file_url: '', expiry_date: '' });
      addToast({ type: 'success', message: 'Document added successfully' });
    } catch (error) {
      addToast({ type: 'error', message: error.response?.data?.detail || 'Failed to add document' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await vehiclesApi.documents.delete(vehicleId, documentId);
      refresh();
      addToast({ type: 'success', message: 'Document deleted successfully' });
    } catch (error) {
      addToast({ type: 'error', message: error.response?.data?.detail || 'Failed to delete document' });
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vehicle Documents</h3>
        <Button onClick={() => setIsAddModalOpen(true)} size="sm">
          <Plus size={16} />
          Add Document
        </Button>
      </div>
      
      <div className="space-y-3">
        {documents.length === 0 ? (
          <p className="text-slate-500 text-sm">No documents uploaded</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.document_id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <div className="font-medium">{doc.document_type}</div>
                <div className="text-sm text-slate-500">
                  Uploaded: {formatDate(doc.uploaded_at)}
                  {doc.expiry_date && ` • Expires: ${formatDate(doc.expiry_date)}`}
                </div>
              </div>
              <div className="flex gap-2">
                <a href={doc.file_url} target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="sm">
                    <Download size={16} />
                  </Button>
                </a>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDeleteConfirm(doc)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Document">
        <form onSubmit={handleAdd} className="space-y-4">
          <Select
            label="Document Type"
            required
            value={formData.document_type}
            onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
            options={DOCUMENT_TYPES.map((t) => ({ value: t, label: t }))}
            placeholder="Select document type"
          />
          <Input
            label="File URL"
            required
            value={formData.file_url}
            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            placeholder="https://example.com/document.pdf"
          />
          <Input
            label="Expiry Date"
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Document'}
            </Button>
          </div>
        </form>
      </Modal>

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Document"
          message={`Are you sure you want to delete ${deleteConfirm.document_type}?`}
          onConfirm={() => handleDelete(deleteConfirm.document_id)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </div>
  );
}
