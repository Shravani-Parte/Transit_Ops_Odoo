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
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
