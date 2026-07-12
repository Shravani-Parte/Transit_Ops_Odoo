import React from "react";
import { X } from "lucide-react";

export default function Drawer({ open, onClose, title, children, width = 480 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="h-full bg-white shadow-lg flex flex-col" style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h4 className="font-semibold">{title}</h4>
          <button className="btn-ghost !p-1" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}
