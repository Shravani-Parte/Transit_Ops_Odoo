import React from "react";
import Table from "@/common/components/Table";
import StatusBadge from "@/common/components/StatusBadge";
import { formatCurrency } from "@/common/utils/formatCurrency";
import { formatDateTime } from "@/common/utils/formatDate";
import { db } from "@/store/mockDb";
export default function MaintenanceTable({ rows, onClose }) {
  const state = db();
  const columns = [
    { key: "vehicle",     header: "Vehicle", render: (r) => state.vehicles.find(v => v.id === r.vehicle_id)?.registration_number || "—" },
    { key: "category",    header: "Category" },
    { key: "description", header: "Description" },
    { key: "cost",        header: "Cost", render: (r) => formatCurrency(r.cost) },
    { key: "opened_at",   header: "Opened", render: (r) => formatDateTime(r.opened_at) },
    { key: "closed_at",   header: "Closed", render: (r) => formatDateTime(r.closed_at) },
    { key: "status",      header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions",     header: "", render: (r) => r.status === "Open" ? <button className="btn-secondary !py-1 !px-2 !text-xs" onClick={() => onClose(r)}>Close</button> : null },
  ];
  return <Table columns={columns} rows={rows} />;
}
