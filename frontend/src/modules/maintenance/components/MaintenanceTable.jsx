<<<<<<< HEAD
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
=======

import Table from '../../../common/components/Table';
import StatusBadge from '../../../common/components/StatusBadge';
import Button from '../../../common/components/Button';
import { formatDate } from '../../../common/utils/formatDate';
import { formatCurrency } from '../../../common/utils/formatCurrency';

export default function MaintenanceTable({ records, onCloseMaintenance }) {
  const columns = [
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'maintenance_type', label: 'Type' },
    { key: 'opened_at', label: 'Date Opened', render: (date) => formatDate(date) },
    { key: 'closed_at', label: 'Date Closed', render: (date) => date ? formatDate(date) : '-' },
    { key: 'cost', label: 'Cost', render: (cost) => formatCurrency(cost) },
    { key: 'status', label: 'Status', render: (status) => <StatusBadge status={status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, record) =>
        record.status === 'Open' ? (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCloseMaintenance(record);
            }}
          >
            Close
          </Button>
        ) : null,
    },
  ];
  return <Table columns={columns} data={records} />;
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
