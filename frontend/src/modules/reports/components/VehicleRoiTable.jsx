import React from "react";
import Table from "@/common/components/Table";
import { formatCurrency } from "@/common/utils/formatCurrency";
export default function VehicleRoiTable({ data }) {
  const columns = [
    { key: "registration_number", header: "Vehicle" },
    { key: "acquisition_cost",    header: "Acquisition", render: (r) => formatCurrency(r.acquisition_cost) },
    { key: "revenue",             header: "Revenue", render: (r) => formatCurrency(r.revenue) },
    { key: "operational_cost",    header: "Op Cost", render: (r) => formatCurrency(r.operational_cost) },
    { key: "roi",                 header: "ROI %", render: (r) => r.roi == null ? "—" : <span className={r.roi >= 0 ? "text-success font-medium" : "text-danger font-medium"}>{r.roi.toFixed(1)}%</span> },
  ];
  return <Table columns={columns} rows={data} />;
}
