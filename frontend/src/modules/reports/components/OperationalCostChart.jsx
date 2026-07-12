import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/common/utils/formatCurrency";
export default function OperationalCostChart({ data }) {
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Operational Cost / Month</div>
      <div className="h-56"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip formatter={(v) => formatCurrency(v)} /><Bar dataKey="cost" fill="#C62828" /></BarChart></ResponsiveContainer></div>
    </div>
  );
}
