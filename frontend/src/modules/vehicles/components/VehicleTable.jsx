import React from "react";
import Table from "@/common/components/Table";
import StatusBadge from "@/common/components/StatusBadge";
import { formatCurrency } from "@/common/utils/formatCurrency";
import { useNavigate } from "react-router-dom";

export default function VehicleTable({ rows }) {
  const nav = useNavigate();
  const columns = [
    { key: "registration_number", header: "Registration" },
    { key: "name_model",          header: "Vehicle" },
    { key: "type",                header: "Type" },
    { key: "region",              header: "Region" },
    { key: "max_load_capacity",   header: "Capacity (kg)" },
    { key: "odometer",            header: "Odometer (km)", render: (r) => Number(r.odometer).toLocaleString("en-IN") },
    { key: "acquisition_cost",    header: "Acquisition", render: (r) => formatCurrency(r.acquisition_cost) },
    { key: "status",              header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return <Table columns={columns} rows={rows} onRowClick={(r) => nav(`/fleet/${r.id}`)} />;
}
