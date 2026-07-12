<<<<<<< HEAD
import React from "react";
import Table from "@/common/components/Table";
import StatusBadge from "@/common/components/StatusBadge";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/common/utils/formatDate";
import { formatCurrency } from "@/common/utils/formatCurrency";
import { db } from "@/store/mockDb";

export default function TripTable({ rows }) {
  const nav = useNavigate();
  const state = db();
  const columns = [
    { key: "id",          header: "Trip" },
    { key: "route",       header: "Route", render: (r) => `${r.source} → ${r.destination}` },
    { key: "vehicle",     header: "Vehicle", render: (r) => state.vehicles.find(v => v.id === r.vehicle_id)?.registration_number || "—" },
    { key: "driver",      header: "Driver", render: (r) => state.drivers.find(d => d.id === r.driver_id)?.name || "—" },
    { key: "cargo_weight",header: "Cargo (kg)" },
    { key: "planned_distance", header: "Distance (km)" },
    { key: "revenue",     header: "Revenue", render: (r) => formatCurrency(r.revenue) },
    { key: "created_at",  header: "Created", render: (r) => formatDate(r.created_at) },
    { key: "status",      header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return <Table columns={columns} rows={rows} onRowClick={(r) => nav(`/trips/${r.id}`)} />;
}
=======

import Table from '../../../common/components/Table';
import StatusBadge from '../../../common/components/StatusBadge';

export default function TripTable({ trips, onTripClick }) {
  const columns = [
    { key: 'trip_code', label: 'Trip Code' },
    { key: 'source', label: 'Source' },
    { key: 'destination', label: 'Destination' },
    { key: 'vehicle_name', label: 'Vehicle' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'status', label: 'Status' },
  ];
  return <Table columns={columns} data={trips} onRowClick={onTripClick} />;
}

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
