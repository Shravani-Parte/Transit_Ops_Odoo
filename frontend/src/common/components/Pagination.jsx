import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange, total, pageSize }) {
  if (totalPages <= 1) return (
    <div className="flex items-center justify-between px-4 py-2 text-xs text-text-muted">
      <span>{total} row{total === 1 ? "" : "s"}</span>
    </div>
  );
  return (
    <div className="flex items-center justify-between px-4 py-2 text-xs text-text-muted">
      <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>
      <div className="flex items-center gap-1">
        <button className="btn-ghost !p-1" onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}><ChevronLeft size={14} /></button>
        <span>{page} / {totalPages}</span>
        <button className="btn-ghost !p-1" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
