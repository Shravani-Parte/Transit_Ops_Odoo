<<<<<<< HEAD
import React from "react";
import EmptyState from "./EmptyState";

export default function Table({ columns, rows, rowKey = "id", onRowClick, empty = "No records found" }) {
  if (!rows || rows.length === 0) return <EmptyState message={empty} />;
  return (
    <div className="overflow-x-auto card">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((c) => <th key={c.key} className="table-th" style={c.width ? { width: c.width } : undefined}>{c.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]} className={`table-row ${onRowClick ? "cursor-pointer" : ""}`} onClick={() => onRowClick?.(row)}>
              {columns.map((c) => (
                <td key={c.key} className="table-td">
                  {c.render ? c.render(row) : row[c.key] ?? "—"}
=======
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

export default function Table({ columns, data, onRowClick, emptyMessage = "No data available" }) {
  if (!data || data.length === 0) return <EmptyState message={emptyMessage} />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? row[columns[0].key] ?? i}
              className={`border-b border-slate-100 dark:border-slate-800 ${onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4">
                  {col.render ? col.render(row[col.key], row) : col.key === 'status' ? <StatusBadge status={row[col.key]} /> : row[col.key]}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
