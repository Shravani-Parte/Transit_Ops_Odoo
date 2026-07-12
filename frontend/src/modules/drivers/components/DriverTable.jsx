<<<<<<< HEAD
import React from "react";
import Table from "@/common/components/Table";
import StatusBadge from "@/common/components/StatusBadge";
import { formatDate, daysUntil } from "@/common/utils/formatDate";
import { useNavigate } from "react-router-dom";

export default function DriverTable({ rows }) {
  const nav = useNavigate();
  const columns = [
    { key: "name",              header: "Driver" },
    { key: "license_number",    header: "License #" },
    { key: "license_category",  header: "Class" },
    { key: "license_expiry_date", header: "License Expiry", render: (r) => {
        const d = daysUntil(r.license_expiry_date);
        return <span className={d < 0 ? "text-danger font-medium" : d <= 30 ? "text-warning font-medium" : ""}>{formatDate(r.license_expiry_date)}</span>;
      } },
    { key: "trip_completion_pct", header: "Trip Completion %", render: (r) => `${r.trip_completion_pct ?? 0}%` },
    { key: "safety_score",      header: "Safety", render: (r) => <span className={Number(r.safety_score) < 80 ? "text-warning" : "text-success"}>{r.safety_score}</span> },
    { key: "status",            header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return <Table columns={columns} rows={rows} onRowClick={(r) => nav(`/drivers/${r.id}`)} />;
}
=======

import Table from '../../../common/components/Table';
import StatusBadge from '../../../common/components/StatusBadge';

export default function DriverTable({ drivers, onDriverClick }) {
  const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'license_number', label: 'License No.' },
    { key: 'license_category', label: 'Category' },
    { key: 'contact_number', label: 'Contact' },
    { key: 'status', label: 'Status' },
  ];
  return <Table columns={columns} data={drivers} onRowClick={onDriverClick} />;
}

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
