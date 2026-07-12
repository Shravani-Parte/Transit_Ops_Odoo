<<<<<<< HEAD
import React from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Confirm", danger = false, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-text-muted">{message}</p>
=======

import Button from './Button';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </div>
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </Modal>
  );
}
